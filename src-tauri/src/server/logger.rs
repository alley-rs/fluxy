use std::time::Instant;

use salvo::http::{Request, Response, StatusCode};
use salvo::{async_trait, Depot, FlowCtrl, Handler};

pub struct Logger;

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
            info!(
                "<b>{}</b> <b>status</b>={} <b>duration</b>={:?} <cyan>-</> uri=<green>{}</> remote_addr={} version={:?} headers={:?} queries={:?}",
                req.method(),
                status.as_u16(),
                duration,
                req.uri().path(),
                req.remote_addr(),
                req.version(),
                req.headers(),  
                req.queries()
            );
        }
        .await
    }
}

