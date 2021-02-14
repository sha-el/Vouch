use async_graphql::ErrorExtensions;
use async_graphql::{Context, FieldResult};
use vouch_lib::{auth::Session, error::ServiceError};

mod application;
mod error;
mod group;
mod mutation_root;
mod organization;
mod query_root;
mod routes;
mod user;

pub use error::Error;
pub use mutation_root::MutationRoot;
pub use query_root::QueryRoot;
pub use routes::{gql_playground, graphql, login, logout};

pub fn check_auth(context: &Context<'_>) -> FieldResult<Session> {
    match context.data_opt::<Session>() {
        Some(session) => Ok(session.clone()),
        None => Err(Error(ServiceError::Unauthorized("Invalid token".into())).extend()),
    }
}
