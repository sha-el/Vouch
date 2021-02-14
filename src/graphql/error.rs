use async_graphql::{Error as AGError, ErrorExtensions, FieldError};
use derive_more::Display;
use vouch_lib::error::ServiceError;

use actix_web::{ResponseError, HttpResponse};

#[derive(Debug, Display, PartialEq, Eq)]
pub struct Error(pub ServiceError);

impl ErrorExtensions for Error {
    fn extend(&self) -> FieldError {
        AGError::new(format!("{}", self.0)).extend_with(|_, e| match &self.0 {
            ServiceError::InternalServerError => {
                e.set("reason", "Internal Server Error");
                e.set("code", 500);
            }
            ServiceError::BadRequest(reason) => {
                e.set("reson", reason.to_owned());
                e.set("code", 400);
            }
            ServiceError::InvalidCredentials => {
                e.set("reson", "Invalid Credentials");
                e.set("code", 400);
            }
            ServiceError::Unauthorized(reason) => {
                e.set("reson", reason.to_owned());
                e.set("code", 401);
            }
            ServiceError::NotFound(reason) => {
                e.set("reson", reason.to_owned());
                e.set("code", 404);
            }
        })
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match &self.0 {
            ServiceError::NotFound(reason) => HttpResponse::NotFound().body(reason),
            ServiceError::InternalServerError => HttpResponse::InternalServerError().finish(),
            ServiceError::BadRequest(reason) => HttpResponse::BadRequest().body(reason),
            ServiceError::InvalidCredentials => HttpResponse::BadRequest().finish(),
            ServiceError::Unauthorized(reason) => HttpResponse::Unauthorized().body(reason),
        }
    }
}
