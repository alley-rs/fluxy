use bytes::Bytes;
use futures::stream::Stream;
use futures::task::{Context, Poll};
use salvo::http::{Body, ReqBody};
use std::cell::OnceCell;
use std::io::Result;
use std::pin::Pin;
use std::time::{Duration, Instant};

pub(super) type ProgressHandler = Box<dyn FnMut(Duration, u64) + Send + Sync + 'static>;

pub(super) struct ReadProgressStream {
    inner: ReqBody,
    bytes_read: u64,
    progress: ProgressHandler,
    start: OnceCell<Instant>,
}

impl ReadProgressStream {
    pub(super) fn new(inner: ReqBody, progress: ProgressHandler) -> Self {
        ReadProgressStream {
            inner,
            progress,
            bytes_read: 0,
            start: OnceCell::new(),
        }
    }
}

impl Stream for ReadProgressStream {
    type Item = Result<Bytes>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let start = self.start.get_or_init(|| Instant::now()).clone();

        let body = &mut self.inner;

        match Body::poll_frame(Pin::new(body), cx) {
            Poll::Ready(Some(Ok(frame))) => {
                let bytes: Bytes = frame.into_data().unwrap();

                let current_time = Instant::now();
                let cost = current_time.duration_since(start);

                let mut bytes_read = self.bytes_read;

                bytes_read += bytes.len() as u64;

                (self.progress)(cost, bytes_read);

                self.bytes_read = bytes_read;

                Poll::Ready(Some(Ok(bytes)))
            }
            Poll::Ready(Some(Err(e))) => Poll::Ready(Some(Err(e))),
            Poll::Ready(None) => Poll::Ready(None),
            Poll::Pending => Poll::Pending,
        }
    }
}
