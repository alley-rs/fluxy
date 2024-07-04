use salvo::{async_trait, http::StatusCode, writing::Json, Depot, Request, Response, Writer};
use serde::Serialize;

pub(super) type ServerResult<T> = std::result::Result<T, ServerError>;

#[derive(Serialize)]
#[serde(untagged)]
pub(super) enum ServerError {
    Bad {
        error: String,
        advice: Option<String>,
    },
    Internal,
}

impl ServerError {
    pub(super) fn new<'a, O1: Into<Option<&'a str>>, O2: Into<Option<&'a str>>>(
        error: O1,
        advice: O2,
    ) -> Self {
        let msg: Option<&str> = error.into();
        let advice: Option<&str> = advice.into();
        let advice = match advice {
            None => None,
            Some(s) => Some(s.to_owned()),
        };

        match msg {
            None => Self::Internal,
            Some(s) => Self::Bad {
                error: s.into(),
                advice,
            },
        }
    }
}

#[async_trait]
impl Writer for ServerError {
    async fn write(self, _req: &mut Request, _depot: &mut Depot, res: &mut Response) {
        match &self {
            ServerError::Bad { .. } => {
                res.status_code(StatusCode::BAD_REQUEST);
                res.render(Json(&self));
            }
            ServerError::Internal => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
            }
        }
    }
}
