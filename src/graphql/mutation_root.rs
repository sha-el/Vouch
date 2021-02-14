use async_graphql::{Context, FieldResult, Object};
use vouch_lib::{auth::login, beatrix::bson::oid::ObjectId};

use super::{
    application::{ApplicationMutationInput, ApplicationNode},
    check_auth,
    group::{GroupMutationInput, GroupNode},
    organization::{self, OrganizationMutationInput, OrganizationNode},
    user::{self, UserMutationInput, UserNode},
};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn hello(&self, ctx: &Context<'_>, input: String) -> FieldResult<String> {
        check_auth(ctx)?;
        Ok(input)
    }

    async fn login(
        &self,
        email: String,
        password: String,
        application: ObjectId,
    ) -> FieldResult<String> {
        let (token, _, _application) = login(&email, &password, application).await?;
        Ok(token)
    }

    async fn sign_up(&self, user: UserMutationInput, password: String) -> FieldResult<UserNode> {
        Ok(UserNode(
            user.save().await?.0.update_password(&password).await?,
        ))
    }

    async fn add_user(&self, ctx: &Context<'_>, user: UserMutationInput) -> FieldResult<UserNode> {
        if user.id.is_some() {
            check_auth(ctx)?;
        }
        user.save().await
    }

    async fn update_password(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        password: String,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::update_password(&user_id, &password).await
    }

    async fn add_application(
        &self,
        ctx: &Context<'_>,
        application: ApplicationMutationInput,
    ) -> FieldResult<ApplicationNode> {
        check_auth(ctx)?;
        application.save().await
    }

    async fn add_group(
        &self,
        ctx: &Context<'_>,
        group: GroupMutationInput,
    ) -> FieldResult<GroupNode> {
        let session = check_auth(ctx)?;
        group.save(session.aud).await
    }

    async fn add_application_to_user(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        application_id: ObjectId,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::add_application(&user_id, &application_id).await
    }

    async fn remove_application_from_user(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        application_id: ObjectId,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::remove_application(&user_id, &application_id).await
    }

    async fn add_permission_to_user(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        permission: Vec<String>,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::add_permission(user_id, permission).await
    }

    async fn add_group_to_user(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        group: Vec<ObjectId>,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::add_group(user_id, group).await
    }

    async fn add_image_for_user(
        &self,
        ctx: &Context<'_>,
        user_id: ObjectId,
        image: String,
    ) -> FieldResult<UserNode> {
        check_auth(ctx)?;
        user::add_image(user_id, image).await
    }

    async fn add_organization(
        &self,
        ctx: &Context<'_>,
        organization: OrganizationMutationInput,
    ) -> FieldResult<OrganizationNode> {
        check_auth(ctx)?;
        organization.save().await
    }

    async fn add_users_to_org(
        &self,
        ctx: &Context<'_>,
        id: ObjectId,
        user_ids: Vec<ObjectId>,
    ) -> FieldResult<OrganizationNode> {
        check_auth(ctx)?;
        organization::add_users(&id, user_ids).await
    }
}
