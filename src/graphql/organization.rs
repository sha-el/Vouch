mod interface;
mod schema;
use super::Error;
use async_graphql::ErrorExtensions;
use async_graphql::FieldResult;
pub use interface::{OrganizationEdge, OrganizationMutationInput, OrganizationNode};
use vouch_lib::{
    beatrix::{
        bson::{doc, oid::ObjectId},
        mongo::MongoModel,
    },
    db::get_db,
    error::ServiceError,
    organization::Organization,
};

pub async fn add_users(id: &ObjectId, user_ids: Vec<ObjectId>) -> FieldResult<OrganizationNode> {
    Ok(OrganizationNode(
        match Organization::find(get_db().await?, doc! {"_id": id}, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(v.add_users(user_ids).await.map_err(|e| Error(e).extend())?),
            None => Err(ServiceError::NotFound("Organization".into())),
        }
        .map_err(|e| Error(e).extend())?,
    ))
}
