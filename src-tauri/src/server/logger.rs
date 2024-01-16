use std::time::Instant;

use salvo::http::{Request, Response, StatusCode};
use salvo::{async_trait, Depot, FlowCtrl, Handler};
use tauri::http::header::{CONTENT_LENGTH, CONTENT_TYPE};

pub(super) struct Logger;

impl Logger {
    #[inline]
    pub fn new() -> Self {
        Logger {}
    }
}

#[async_trait]
impl Handler for Logger {
    async fn handle(
        &self,
        req: &mut Request,
        depot: &mut Depot,
        res: &mut Response,
        ctrl: &mut FlowCtrl,
    ) {
        async move {
            let now = Instant::now();
            ctrl.call_next(req, depot, res).await;
            let duration = now.elapsed();

            let status = res.status_code.unwrap_or(StatusCode::OK);

            let headers = req.headers();

            #[cfg(feature = "log-paris")]
            info!(
                "<b>{}</b> <b>status</b>={} <b>duration</b>={:?} <cyan>-</> uri=<green>{}</> remote_addr={} content-type={:?} content-length={:?} queries={:?}",
                req.method(),
                status.as_u16(),
                duration,
                req.uri().path(),
                req.remote_addr(),
                headers.get(CONTENT_TYPE.to_string()),
                headers.get(CONTENT_LENGTH.to_string()),
                req.queries()
            );
            #[cfg(not(feature = "log-paris"))]
            info!(
                "method={} status={} duration={:?} uri={} remote_addr={} content-type={:?} content-length={:?} queries={:?}",
                req.method(),
                status.as_u16(),
                duration,
                req.uri().path(),
                req.remote_addr(),
                headers.get(CONTENT_TYPE.to_string()),
                headers.get(CONTENT_LENGTH.to_string()),
                req.queries()
            );
        }
        .await
    }
}
