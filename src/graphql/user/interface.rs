use async_graphql::{ErrorExtensions, FieldResult, InputObject};
use vouch_lib::{
    beatrix::{
        bson::{doc, oid::ObjectId, DateTime},
        mongo::MongoModel,
    },
    db::get_db,
    user::User,
};

use crate::graphql::Error;

pub struct UserEdge {
    pub first: Option<i64>,
    pub offset: Option<i64>,
    pub email_i_contains: Option<String>,
    pub ids: Option<Vec<ObjectId>>,
}

pub struct UserNode(pub User);

#[derive(InputObject)]
pub struct UserMutationInput {
    // TODO: Add validations.
    // #[validate(StringMinLength(value = "12"), StringMaxLength(value = "12"))]
    pub id: Option<ObjectId>,
    pub email: String,
    pub first_name: Option<String>,
    pub middle_name: Option<String>,
    pub last_name: Option<String>,
}

impl UserMutationInput {
    pub async fn into_user(self) -> FieldResult<User> {
        let mut user = match self {
            UserMutationInput {
                id,
                email,
                first_name,
                last_name,
                middle_name,
            } => User {
                id,
                email,
                first_name,
                last_name,
                middle_name,
                password: None,
                applications: None,
                last_login: None,
                permissions: None,
                groups: None,
                image: None,
                default_organization: None,
                updated_at: DateTime(chrono::Utc::now()),
            },
        };

        if user.id.is_some() {
            let existing_user = User::find(
                get_db().await?,
                doc! {"_id": user.id.clone().unwrap()},
                None,
            )
            .await
            .map_err(|e| Error(e.into()).extend())?
            .unwrap();

            user.password = existing_user.password;
            user.applications = existing_user.applications;
            user.last_login = existing_user.last_login;
            user.permissions = existing_user.permissions;
            user.groups = existing_user.groups;
            user.image = existing_user.image;
            user.default_organization = existing_user.default_organization;
        }

        Ok(user)
    }

    pub async fn save(self) -> FieldResult<UserNode> {
        let mut form = self.into_user().await?;
        form.save(get_db().await?)
            .await
            .map_err(|e| Error(e.into()).extend())?;
        Ok(UserNode(form))
    }
}
