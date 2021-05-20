use actix_identity::Identity;
use actix_web::{
    get,
    http::{header, StatusCode},
    post, web, HttpResponse,
};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::{EmptySubscription, Schema};
use async_graphql_actix_web::{Request, Response};
use serde::{Deserialize, Serialize};
use vouch_lib::{
    auth::login as auth_login,
    auth::Session,
    beatrix::bson::oid::ObjectId,
    error::ServiceError,
    jsonwebtoken::{decode, DecodingKey, Validation},
};

use super::{error::Error, MutationRoot, QueryRoot};

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginInput {
    pub email: String,
    pub password: String,
    pub application: String,
}

#[post("/api/graphql")]
pub async fn graphql(
    schema: web::Data<Schema<QueryRoot, MutationRoot, EmptySubscription>>,
    gql_req: Request,
    id: Identity,
) -> Response {
    let session = if let Some(token) = id.identity() {
        println!("{:?}", token);
        decode::<Session>(
            &token,
            &DecodingKey::from_secret(std::env::var("JWT_KEY").unwrap().as_ref()),
            &Validation::default(),
        )
        .ok()
    } else {
        None
    };

    let mut query = gql_req.into_inner();
    if let Some(session) = session {
        query = query.data(session.claims);
    }
    schema.execute(query).await.into()
}

#[get("/api/graphql")]
pub async fn gql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new(
            "/api/graphql",
        )))
}

#[post("/api/login")]
pub async fn login(id: Identity, item: web::Json<LoginInput>) -> Result<HttpResponse, Error> {
    let (token, _, application) = auth_login(
        &item.email,
        &item.password,
        ObjectId::with_string(&item.application).map_err(|_| {
            Error(ServiceError::BadRequest(
                "Invalid ObjectId for application".into(),
            ))
        })?,
    )
    .await
    .map_err(Error)?;
    id.remember(token);

    Ok(HttpResponse::PermanentRedirect()
        .status(StatusCode::OK)
        .header(header::LOCATION, application.redirect_url)
        .finish()
        .into_body())
}

#[post("/api/logout")]
pub async fn logout(id: Identity) -> Result<HttpResponse, Error> {
    id.remember("value".to_string());

    Ok(HttpResponse::PermanentRedirect()
        .status(StatusCode::OK)
        .finish()
        .into_body())
}
