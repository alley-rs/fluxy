mod util;

use std::{
    io,
    net::{Ipv4Addr, SocketAddr},
    path::{Path, PathBuf},
    time::Instant,
};

use serde::Serialize;
use sha1::{Digest, Sha1};
use tauri::Manager;
use tokio::{
    fs,
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpListener, TcpStream},
};

use crate::error::{AlleyError, AlleyResult};

use self::util::format_file_size;

const CHUNK_SIZE: usize = 8192; // 每个块8KB

#[derive(Debug, Serialize, Clone)]
struct Task<'a> {
    path: &'a Path,
    name: &'a str,
    percent: f64,
    speed: f64, // MB/s
    size: &'a str,
    aborted: bool,
}

impl<'a> Task<'a> {
    fn new(
        path: &'a Path,
        name: &'a str,
        size: &'a str,
        percent: f64,
        speed: f64,
        aborted: bool,
    ) -> Self {
        Self {
            path,
            name,
            percent,
            speed,
            size,
            aborted,
        }
    }
}

struct File {
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
                    &path,
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
                            &path,
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

async fn calculate_sha1() {}

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
pub enum MessageState {
    PairRequest,
    Text(String),
    File(File),
}

pub struct Listener {
    local_listener: TcpListener,
    remote_stream: TcpStream,
}

impl Listener {
    const PORT: u16 = 5800;

    pub async fn new(addr: &SocketAddr) -> io::Result<Self> {
        // 监听本地端口
        let listener = TcpListener::bind((Ipv4Addr::UNSPECIFIED, Self::PORT)).await?;

        // 连接远端
        let stream = TcpStream::connect(addr).await?;

        Ok(Self {
            local_listener: listener,
            remote_stream: stream,
        })
    }

    pub async fn handle_send(
        &mut self,
        message: Message,
        window: tauri::WebviewWindow,
    ) -> io::Result<MessageState> {
        let state = match message {
            Message::Text(s) => {
                self.remote_stream.write_all(s.as_bytes()).await?;
                MessageState::Text(s)
            }
            Message::Path(p) => {
                MessageState::File(File::send(&p, &mut self.remote_stream, window).await?)
            }
        };

        Ok(state)
    }

    async fn get_message_header(&mut self, stream: &mut TcpStream) -> io::Result<MessageHeader> {
        let n = stream.read_u8().await?;

        match MessageHeader::try_from(n) {
            Ok(header) => Ok(header),
            Err(e) => Err(io::Error::new(io::ErrorKind::InvalidData, e)),
        }
    }

    pub async fn handle_recieve(
        &mut self,
        window: &tauri::WebviewWindow,
    ) -> AlleyResult<MessageState> {
        let (mut stream, _) = self.local_listener.accept().await?;

        loop {
            let header = self.get_message_header(&mut stream).await?;

            let msg = match header {
                MessageHeader::PairRequest => {
                    // TODO: 处理配对请求
                    println!("Connection established.");
                    MessageState::PairRequest
                }
                MessageHeader::File => {
                    let file = File::receive(&mut stream, &window).await?;
                    MessageState::File(file)
                }
                MessageHeader::Text => {
                    let mut buf = [0u8; CHUNK_SIZE]; // 文本上限与块大小保持一致，懒得改了，8KB字符够用了
                    let len = stream.read(&mut buf).await?;
                    let msg = String::from_utf8_lossy(&buf[..len]);
                    MessageState::Text(msg.to_string())
                }
            };

            return Ok(msg);
        }
    }
}
