use std::{
    collections::HashMap,
    io,
    net::{IpAddr, Ipv4Addr, SocketAddr, SocketAddrV4},
    str::FromStr,
    sync::Arc,
    thread,
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tokio::{net::UdpSocket, sync::RwLock};

use crate::lazy::LOCAL_IP;

const MULTICAST_ADDRESS: Ipv4Addr = Ipv4Addr::new(226, 4, 55, 1);
const MULTICAST_PORT: u16 = 55412;
const BROADCAST_INTERVAL_SECS: u64 = 5; // 广播间隔时间(秒)
const MAX_REMOTE_TERMINALS: usize = 5; // 扫描的远端数量上限
const MAX_RECEIVE_ATTEMPTS: usize = 15; // 接收时最大循环次数

lazy_static! {
    static ref REMOTE_TERMINALS: RwLock<HashMap<IpAddr, RemoteTerminalInfo>> =
        RwLock::new(HashMap::new());
    static ref SHOULD_STOP_BROADCASTING: RwLock<bool> = RwLock::new(false);
}

async fn should_stop_broadcasting() -> bool {
    *SHOULD_STOP_BROADCASTING.read().await
}

async fn stop_broadcasting() {
    let mut ok = SHOULD_STOP_BROADCASTING.write().await;
    *ok = false;
}

#[derive(Serialize, Clone)]
pub struct MulticastMessage {
    name: String,
    addr: IpAddr,
}

impl MulticastMessage {
    fn new(name: String, addr: IpAddr) -> Self {
        Self { name, addr }
    }
}

type MessageHandler = fn(message: MulticastMessage);

pub struct Multicast {
    sender: Arc<UdpSocket>,
    receiver: Arc<UdpSocket>,
    message_handler: MessageHandler,
}

impl Multicast {
    pub async fn new(message_handler: MessageHandler) -> io::Result<Self> {
        let socket = create_socket().await?;

        let r = Arc::new(socket);
        let s = r.clone();

        Ok(Self {
            sender: s,
            receiver: r,
            message_handler,
        })
    }

    fn start_receiving_loop(&'static self) {
        tokio::spawn(async move {
            let mut buf = [0; 512]; // 最多只接收 512 个字节

            for _ in 0..MAX_RECEIVE_ATTEMPTS {
                if should_stop_broadcasting().await {
                    info!("停止接收组播消息");
                    break;
                } else if self.remote_terminals_count_reached().await {
                    info!("停止接收组播消息");
                    stop_broadcasting().await; // 同时停止发送消息
                    break;
                }

                if let Ok((amt, src)) = self.receiver.recv_from(&mut buf).await {
                    self.handle_received_message(amt, src, &buf).await;
                }
            }
        });
    }

    fn start_sending_loop(&'static self) {
        tokio::spawn(async move {
            loop {
                if should_stop_broadcasting().await {
                    info!("停止发送组播消息");
                    break;
                }

                if let Ok(remote_terminal_info) = new_message() {
                    if let Ok(bytes) = serde_json::to_vec(&remote_terminal_info) {
                        if let Err(e) = self
                            .sender
                            .send_to(&bytes, (MULTICAST_ADDRESS, MULTICAST_PORT))
                            .await
                        {
                            error!("发送组播消息失败: {}", e);
                        }
                    } else {
                        error!("序列化消息失败");
                    }
                } else {
                    error!("获取本机信息失败");
                }

                // 消息广播过快没有意义，设置发送间隔以降低网络负载
                thread::sleep(Duration::from_secs(BROADCAST_INTERVAL_SECS));
            }
        });
    }

    async fn remote_terminals_count_reached(&self) -> bool {
        let remote_terminals = REMOTE_TERMINALS.read().await;

        remote_terminals.len() >= MAX_REMOTE_TERMINALS
    }

    async fn handle_received_message(&self, amt: usize, src: SocketAddr, buf: &[u8]) {
        let remote_terminal_ip = src.ip();

        if remote_terminal_ip == IpAddr::V4(Ipv4Addr::from_str(&LOCAL_IP).unwrap())
            || self.is_remote_terminal_known(remote_terminal_ip).await
        {
            return;
        }

        if let Ok(rti) = serde_json::from_slice::<RemoteTerminalInfo>(&buf[..amt]) {
            info!("接收到组播消息：{:?}，来源：{}", rti, src);

            let remote_string = rti.to_string();
            self.add_remote_terminal(remote_terminal_ip, rti).await;
            (self.message_handler)(MulticastMessage::new(remote_string, remote_terminal_ip));
        } else {
            error!("反序列化消息失败");
        }
    }

    async fn is_remote_terminal_known(&self, remote_terminal_ip: IpAddr) -> bool {
        let remote_terminals = REMOTE_TERMINALS.read().await;

        remote_terminals.contains_key(&remote_terminal_ip)
    }

    async fn add_remote_terminal(&self, remote_terminal_ip: IpAddr, rti: RemoteTerminalInfo) {
        let mut terminals = REMOTE_TERMINALS.write().await;

        terminals.insert(remote_terminal_ip, rti);
    }

    pub fn listen(&'static self) {
        self.start_receiving_loop();
        self.start_sending_loop();
    }
}

async fn create_socket() -> io::Result<UdpSocket> {
    let socket_addr = SocketAddrV4::new(Ipv4Addr::UNSPECIFIED, MULTICAST_PORT);
    let socket = UdpSocket::bind(socket_addr).await?;

    socket.join_multicast_v4(MULTICAST_ADDRESS, Ipv4Addr::UNSPECIFIED)?;

    socket.set_multicast_loop_v4(true)?;

    Ok(socket)
}

#[derive(Serialize, Deserialize, Debug)]
struct RemoteTerminalInfo {
    name: Option<String>,
    hostname: String,
    os_type: String,
    edition: Option<String>,
    version: String,
}

impl RemoteTerminalInfo {
    fn to_string(&self) -> String {
        match &self.name {
            Some(s) => s.to_owned(),
            None => format!("{}-{}", self.hostname, self.os_type),
        }
    }
}

fn new_message() -> io::Result<RemoteTerminalInfo> {
    // TODO: 先获取用户设置的名称
    // let name = get_custom_name();
    let hostname = hostname::get()?;

    let info = os_info::get();

    Ok(RemoteTerminalInfo {
        name: None,
        hostname: hostname.to_str().unwrap().to_string(),
        os_type: info.os_type().to_string(),
        edition: info.edition().map(|s| s.to_string()),
        version: info.version().to_string(),
    })
}
