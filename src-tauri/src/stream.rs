use bytes::Bytes;
use futures::stream::Stream;
use futures::task::{Context, Poll};
use pin_project_lite::pin_project;
use salvo::http::ReqBody;
use std::cell::OnceCell;
use std::io::Result;
use std::pin::Pin;
use std::time::{Duration, Instant};

pub(super) type ProgressHandler = Box<dyn FnMut(Duration, u64) + Send + Sync + 'static>;

pin_project! {
    pub(super) struct ReadProgressStream {
        #[pin]
        inner: Pin<Box<ReqBody>>,
        bytes_read: u64,
        progress: ProgressHandler,
        start: OnceCell<Instant>,
    }
}

impl ReadProgressStream {
    pub(super) fn new(inner: ReqBody, progress: ProgressHandler) -> Self {
        ReadProgressStream {
            inner: Box::pin(inner),
            progress,
            bytes_read: 0,
            start: OnceCell::new(),
        }
    }
}

impl Stream for ReadProgressStream {
    type Item = Result<Bytes>;

    fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let this = self.project();

        let start = this.start.get_or_init(|| Instant::now());

        match this.inner.poll_next(cx) {
            Poll::Ready(reader) => match reader {
                Some(result) => match result {
                    Ok(frame) => {
                        let bytes = frame.into_data().unwrap();

                        let current_time = Instant::now();
                        let cost = current_time.duration_since(*start);

                        *this.bytes_read += bytes.len() as u64;

                        (this.progress)(cost, *this.bytes_read);

                        Poll::Ready(Some(Ok(bytes)))
                    }
                    Err(e) => Poll::Ready(Some(Err(e))),
                },
                None => Poll::Ready(None),
            },
            Poll::Pending => Poll::Pending,
        }
    }
}
