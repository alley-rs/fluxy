mod task;
mod util;

use std::{
    io,
    net::{IpAddr, Ipv4Addr, SocketAddr},
    path::{Path, PathBuf},
    sync::Arc,
    time::{Duration, Instant},
};

use bytes::BytesMut;
use serde::Serialize;
use sha1::{Digest, Sha1};
use tauri::Emitter;
use tokio::{
    fs,
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpListener, TcpStream},
    sync::Mutex,
    time::timeout,
};

use crate::error::{AlleyError, AlleyResult};

use self::{task::Task, util::format_file_size};

const CHUNK_SIZE: usize = 8192; // 每个块8KB

#[derive(Debug, Serialize)]
pub struct File {
    size: u64,
    path: PathBuf,
}

impl File {
    async fn send(
        path: &Path,
        stream: &mut TcpStream,
        window: tauri::WebviewWindow,
    ) -> io::Result<Self> {
        let mut file = fs::File::open(path).await?;

        let size = file.metadata().await?.len();

        let formatted_size = format_file_size(size);

        let mut hasher = Sha1::new();

        // TODO: 先发送消息类型 1

        // TODO: 再发送文件大小

        let mut buffer = [0; CHUNK_SIZE];

        let start = Instant::now();

        let mut sended_size: usize = 0;

        loop {
            let len: usize = file.read(&mut buffer).await?;
            if len == 0 {
                break;
            }
            let bytes = &buffer[..len];

            let mut chunk_hasher = Sha1::new();
            chunk_hasher.update(bytes);

            // 发送当前块的SHA1（这里简化处理，实际应用可能需要设计更复杂的协议来标识块和校验和）
            let chunk_sha1 = format!("{:x}", chunk_hasher.finalize());
            stream.write_all(chunk_sha1.as_bytes()).await?;
            stream.write_all(bytes).await?;

            hasher.update(bytes);

            sended_size += len;

            let cost = Instant::now().duration_since(start);

            let percent = (len * 1000 / (size as usize)) as f64 / 10.0;
            // 纳秒转为浮点数的秒
            let cost_senconds = cost.as_nanos() as f64 / 1000000000.0;

            // chunk_size 转为浮点数的 mb
            let progress = sended_size as f64 / (1024 * 1024) as f64;
            let speed = progress / cost_senconds;

            let _ = window.emit(
                "send-file",
                Task::new(
                    path,
                    path.file_name().unwrap().to_str().unwrap(),
                    &formatted_size,
                    percent,
                    speed,
                    false,
                ),
            );
        }

        // 发送整个文件的SHA1
        let file_sha1 = format!("{:x}", hasher.finalize());
        stream.write_all(file_sha1.as_bytes()).await?;

        Ok(Self {
            path: path.into(),
            size,
        })
    }

    async fn receive(stream: &mut TcpStream, window: &tauri::WebviewWindow) -> AlleyResult<Self> {
        // TODO: 获取流中的文件大小
        let size = 0;
        let formatted_size = format_file_size(size);

        let path = Path::new("/real/path"); // 保存路径

        let mut hasher = Sha1::new();

        let start = Instant::now();

        let mut received_size: usize = 0;

        loop {
            let mut sha1_buffer = [0u8; 40];

            match stream.read_exact(&mut sha1_buffer).await {
                Ok(_) => {
                    // 读取数据块
                    let mut data_buffer = vec![0u8; CHUNK_SIZE]; // CHUNK_SIZE与发送端一致
                    let len = stream.read(&mut data_buffer).await.unwrap();

                    // 计算实际数据块的SHA-1
                    let mut chunk_hasher = Sha1::new();
                    chunk_hasher.update(&data_buffer[..len]);
                    let actual_sha1 = chunk_hasher.finalize();

                    // 验证当前块的SHA-1
                    if sha1_buffer != *actual_sha1 {
                        return Err(AlleyError::NotMatch(
                            "Data corruption detected for this chunk!".to_string(),
                        ));
                    } else {
                        hasher.update(&data_buffer[..len]);
                    }

                    received_size += len;

                    let cost = Instant::now().duration_since(start);

                    let percent = (len * 1000 / (size as usize)) as f64 / 10.0;
                    // 纳秒转为浮点数的秒
                    let cost_senconds = cost.as_nanos() as f64 / 1000000000.0;

                    // chunk_size 转为浮点数的 mb
                    let progress = received_size as f64 / (1024 * 1024) as f64;
                    let speed = progress / cost_senconds;

                    let _ = window.emit(
                        "receive-file",
                        Task::new(
                            path,
                            path.file_name().unwrap().to_str().unwrap(),
                            &formatted_size,
                            percent,
                            speed,
                            false,
                        ),
                    );

                    // 检查是否为文件结束标识（例如，可以通过约定的结束消息或特定的结束符）
                    // 这里简化处理，实际应用中需要更精确的结束条件判断
                    if len < CHUNK_SIZE {
                        break;
                    }
                }
                Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => {
                    // 读取结束，开始验证整个文件的SHA-1
                    break;
                }
                Err(e) => {
                    println!("Error reading from stream: {}", e);
                    return Err(AlleyError::Io(e));
                }
            }
        }

        // 读取并验证整个文件的SHA-1
        let mut file_sha1_buffer = [0u8; 40];
        stream.read_exact(&mut file_sha1_buffer).await.unwrap();

        if file_sha1_buffer == *hasher.finalize() {
            println!("File received successfully, SHA-1 verified.");
        } else {
            println!("File integrity check failed!");
        }

        Ok(Self {
            size,
            path: path.into(),
        })
    }
}

#[derive(PartialEq)]
enum MessageHeader {
    PairRequest,
    Text,
    File,
}

impl TryFrom<u8> for MessageHeader {
    type Error = AlleyError;
    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(MessageHeader::PairRequest),
            1 => Ok(MessageHeader::Text),
            2 => Ok(MessageHeader::File),
            _ => Err(AlleyError::InvalidMessageType(value)),
        }
    }
}

pub enum Message {
    Text(String),
    Path(PathBuf),
}

/// 给前端展示用的数据结构
#[derive(Debug, Serialize)]
pub enum MessageState {
    PairRequest,
    Text(String),
    File(File),
}

#[derive(Debug, PartialEq)]
pub(crate) enum PairResponse {
    Accept,
    Reject,
}

impl TryFrom<String> for PairResponse {
    type Error = AlleyError;
    fn try_from(value: String) -> AlleyResult<Self> {
        match value.as_str() {
            "accept" => Ok(PairResponse::Accept),
            "reject" => Ok(PairResponse::Reject),
            _ => Err(AlleyError::InvalidPairResponse(value.to_string())),
        }
    }
}

impl From<&PairResponse> for u8 {
    fn from(val: &PairResponse) -> Self {
        match val {
            PairResponse::Accept => 0,
            PairResponse::Reject => 1,
        }
    }
}

pub struct Peer {
    local_listener: TcpListener,
    paired_peer: Option<(IpAddr, Arc<Mutex<TcpStream>>)>,
}

impl Peer {
    const PORT: u16 = 5800;

    pub(super) async fn new() -> io::Result<Self> {
        // 监听本地端口
        let listener = TcpListener::bind((Ipv4Addr::UNSPECIFIED, Self::PORT)).await?;

        Ok(Self {
            local_listener: listener,
            paired_peer: None,
        })
    }

    pub(super) async fn listen(&mut self) -> AlleyResult<()> {
        loop {
            let (mut stream, remote_addr) = self.local_listener.accept().await?;
            if let Some((paired_addr, _)) = &self.paired_peer {
                if *paired_addr != remote_addr.ip() {
                    stream.write_all(b"BUSY").await?;
                    continue;
                }
            }

            self.handle_incoming_connection(stream).await?;
        }
    }

    fn pair(&mut self, peer_addr: IpAddr, stream: TcpStream) {
        if self.paired_peer.is_none() {
            self.paired_peer = Some((peer_addr, Arc::new(Mutex::new(stream))));
        }
    }

    async fn handle_pairing_request(&mut self, mut stream: TcpStream) -> io::Result<()> {
        // TODO: 这里添加用户交互逻辑，通过GUI询问用户是否接受配对

        let accept = true; // 假设用户同意配对

        if accept {
            stream.write_all(b"PAIROK").await?;
            let addr = stream.peer_addr()?;
            self.pair(addr.ip(), stream);
            Ok(())
        } else {
            stream.write_all(b"PAIRNO").await?;
            Err(io::Error::new(io::ErrorKind::Other, "Pairing refused"))
        }
    }

    async fn handle_incoming_connection(&mut self, mut stream: TcpStream) -> AlleyResult<()> {
        let mut buffer = BytesMut::with_capacity(1024);
        stream.read_buf(&mut buffer).await?;
        let data = String::from_utf8_lossy(&buffer);
        if data.starts_with("PAIR?") {
            self.handle_pairing_request(stream).await?;
        } else if data.starts_with("FILE") {
            let file_path = data.trim_start_matches("FILE").trim();
            self.receive_file(&mut stream, file_path).await?;
        } else {
            // 处理文本消息
            println!("Received: {}", data.trim());
        }

        Ok(())
    }

    async fn send_pairing_request(&mut self, addr: &IpAddr) -> AlleyResult<()> {
        let mut stream = TcpStream::connect(SocketAddr::new(*addr, Self::PORT)).await?;

        stream.write_all(b"PAIR?").await?;

        let mut response = String::new();
        timeout(
            Duration::from_secs(10),
            stream.read_to_string(&mut response),
        )
        .await??;

        if response.trim() == "PAIROK" {
            self.pair(*addr, stream); // 成功配对，保存流
            Ok(())
        } else {
            Err(AlleyError::PairingRefuse)
        }
    }

    async fn send_text_message(&self, message: &str) -> AlleyResult<()> {
        if let Some((_, ref stream)) = &self.paired_peer {
            let mut stream_lock = stream.lock().await;
            stream_lock.write_all(message.as_bytes()).await?;
        }

        Ok(())
    }

    async fn send_file(&self, file_path: &str) -> AlleyResult<()> {
        if let Some((_, ref stream)) = &self.paired_peer {
            let mut file = fs::File::open(file_path).await?;
            let mut buffer = [0; 1024];

            let mut stream_lock = stream.lock().await;
            stream_lock.write_all(b"FILE").await?;
            stream_lock.write_all(file_path.as_bytes()).await?;
            stream_lock.write_all(b"\n").await?;

            loop {
                let n = file.read(&mut buffer).await?;
                if n == 0 {
                    break;
                }
                stream_lock.write_all(&buffer[..n]).await?;
            }
        }

        Ok(())
    }

    async fn receive_file(&self, stream: &mut TcpStream, file_path: &str) -> io::Result<()> {
        let mut file = fs::File::create(file_path).await?;
        let mut buffer = [0; 1024];

        loop {
            let n = stream.read(&mut buffer).await?;
            if n == 0 {
                break;
            }
            file.write_all(&buffer[..n]).await?;
        }

        Ok(())
    }

    async fn get_message_header(&mut self, stream: &mut TcpStream) -> io::Result<MessageHeader> {
        let n: u8 = stream.read_u8().await?;

        match MessageHeader::try_from(n) {
            Ok(header) => Ok(header),
            Err(e) => Err(io::Error::new(io::ErrorKind::InvalidData, e)),
        }
    }
}
