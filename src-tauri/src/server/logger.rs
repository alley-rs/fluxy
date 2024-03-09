use std::time::Instant;

use salvo::http::header::{CONTENT_LENGTH, CONTENT_TYPE};
use salvo::http::{Request, Response, StatusCode};
use salvo::{async_trait, Depot, FlowCtrl, Handler};

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

            info!(
                method = ?req.method(),
                status = status.as_u16(),
                duration = ?duration,
                path = ?req.uri().path(),
                client_ip = ?req.remote_addr(),
                content_type = ?headers.get(CONTENT_TYPE),
                content_length = ?headers.get(CONTENT_LENGTH),
                queries = ?req.queries(),
            );
        }
        .await
    }
}
