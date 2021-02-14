use async_graphql::ErrorExtensions;
use async_graphql::{Context, FieldResult, Object};
use vouch_lib::beatrix::mongo::MongoModel;
use vouch_lib::{
    beatrix::bson::{doc, oid::ObjectId},
    db::get_db,
    error::ServiceError,
    user::User,
};

use super::{
    application::ApplicationEdge,
    check_auth,
    group::GroupEdge,
    organization::{OrganizationEdge, OrganizationNode},
    user::{UserEdge, UserNode},
    Error,
};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn user_edge(
        &self,
        ctx: &Context<'_>,
        first: Option<i64>,
        offset: Option<i64>,
        email_i_contains: Option<String>,
    ) -> FieldResult<UserEdge> {
        check_auth(ctx)?;

        Ok(UserEdge {
            first,
            offset,
            email_i_contains,
            ids: None,
        })
    }

    async fn user(&self, ctx: &Context<'_>, id: ObjectId) -> FieldResult<UserNode> {
        check_auth(ctx)?;

        Ok(UserNode(
            match User::find(get_db().await?, doc! {"_id": id}, None)
                .await
                .map_err(|e| Error(e.into()).extend())?
            {
                Some(v) => Ok(v),
                None => Err(ServiceError::NotFound("User not found".into())),
            }?,
        ))
    }

    async fn me(&self, ctx: &Context<'_>) -> FieldResult<UserNode> {
        let session = check_auth(ctx)?;
        Ok(UserNode(
            session.get_user().await.map_err(|e| Error(e).extend())?,
        ))
    }

    async fn current_organization(
        &self,
        ctx: &Context<'_>,
    ) -> FieldResult<Option<OrganizationNode>> {
        let session = check_auth(ctx)?;
        println!("{:?}", session);
        match session.org {
            Some(v) => Ok(OrganizationNode::find(doc! { "_id": v }).await?),
            None => Ok(None),
        }
    }

    async fn application_edge(
        &self,
        ctx: &Context<'_>,
        first: Option<i64>,
        offset: Option<i64>,
        name_i_contains: Option<String>,
        ids: Option<Vec<ObjectId>>,
    ) -> FieldResult<ApplicationEdge> {
        check_auth(ctx)?;

        Ok(ApplicationEdge {
            first,
            offset,
            name_i_contains,
            ids,
        })
    }

    async fn group_edge(
        &self,
        ctx: &Context<'_>,
        first: Option<i64>,
        offset: Option<i64>,
        name_i_contains: Option<String>,
    ) -> FieldResult<GroupEdge> {
        check_auth(ctx)?;

        Ok(GroupEdge {
            first,
            offset,
            name_i_contains,
            ids: None,
        })
    }

    async fn organization_edge(
        &self,
        ctx: &Context<'_>,
        first: Option<i64>,
        offset: Option<i64>,
        name_i_contains: Option<String>,
        user_id: Option<ObjectId>,
    ) -> FieldResult<OrganizationEdge> {
        check_auth(ctx)?;
        Ok(OrganizationEdge {
            first,
            offset,
            name_i_contains,
            user_id,
        })
    }
}
