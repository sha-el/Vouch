use beatrix::mongo::error::Error;
use beatrix::{bson, mongodb};
use derive_more::Display;

#[derive(Debug, Display, PartialEq, Eq)]
pub enum ServiceError {
    #[display(fmt = "Internal Server Error")]
    InternalServerError,

    #[display(fmt = "BadRequest: {}", _0)]
    BadRequest(String),

    #[display(fmt = "Invalid Username or password")]
    InvalidCredentials,

    #[display(fmt = "Unauthorized {}", _0)]
    Unauthorized(String),

    #[display(fmt = "{} Not Found", _0)]
    NotFound(String),
}

impl From<mongodb::error::Error> for ServiceError {
    fn from(err: mongodb::error::Error) -> Self {
        let e = err.kind;
        {
            println!("Mongo Error, {:?}", e);
            ServiceError::InternalServerError
        }
    }
}

impl From<Error> for ServiceError {
    fn from(err: Error) -> Self {
        println!("{}", err);
        ServiceError::InternalServerError
    }
}

// impl From<bson::ValueAccessError> for ServiceError {
//     fn from(err: bson::ValueAccessError) -> Self {
//         match err {
//             bson::ValueAccessError::NotPresent => ServiceError::NotFound("Key not found".into()),
//             bson::ValueAccessError::UnexpectedType => ServiceError::InternalServerError,
//         }
//     }
// }

impl From<bson::oid::Error> for ServiceError {
    fn from(err: bson::oid::Error) -> Self {
        match err {
            bson::oid::Error::FromHexError(_) => {
                ServiceError::Unauthorized("Application not found".into())
            }
            e => {
                println!("{:?}", e);
                Self::InternalServerError
            }
        }
    }
}

impl From<jsonwebtoken::errors::Error> for ServiceError {
    fn from(err: jsonwebtoken::errors::Error) -> Self {
        println!("Error: {:?}", err);

        Self::Unauthorized("Invalid token".into())
    }
}
