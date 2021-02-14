use async_graphql::ErrorExtensions;
use async_graphql::FieldResult;
use vouch_lib::{
    application::Application,
    beatrix::bson::{doc, oid::ObjectId},
    error::ServiceError,
    user::User,
};
use vouch_lib::{beatrix::mongo::MongoModel, db::get_db};

use super::Error;

mod interface;
mod schema;

pub use interface::{UserEdge, UserMutationInput, UserNode};

pub async fn update_password(id: &ObjectId, password: &str) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v
                .update_password(password)
                .await
                .map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}

pub async fn add_application(id: &ObjectId, application_id: &ObjectId) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v
                .add_application(
                    match Application::find(get_db().await?, doc! { "_id": application_id }, None)
                        .await
                        .map_err(|e| Error(e.into()).extend())?
                    {
                        Some(v) => Ok(v),
                        None => Err(ServiceError::NotFound("Application".into())),
                    }
                    .map_err(|e| Error(e.into()).extend())?,
                )
                .await
                .map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}

pub async fn remove_application(id: &ObjectId, application_id: &ObjectId) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v
                .remove_application(
                    match Application::find(get_db().await?, doc! { "_id": application_id }, None)
                        .await
                        .map_err(|e| Error(e.into()).extend())?
                    {
                        Some(v) => Ok(v),
                        None => Err(ServiceError::NotFound("Application".into())),
                    }
                    .map_err(|e| Error(e.into()).extend())?,
                )
                .await
                .map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}

pub async fn add_permission(id: ObjectId, permissions: Vec<String>) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v.add_permission(permissions).await?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}

pub async fn add_group(id: ObjectId, group: Vec<ObjectId>) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v.add_group(group).await.map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}

pub async fn add_image(id: ObjectId, image: String) -> FieldResult<UserNode> {
    Ok(UserNode(
        match User::find(get_db().await?, doc! { "_id": id }, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v.add_image(image).await.map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("User".into())),
        }
        .map_err(|e| Error(e.into()).extend())?,
    ))
}
