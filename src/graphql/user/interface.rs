use async_graphql::{ErrorExtensions, FieldResult, InputObject};
use vouch_lib::{
    beatrix::{
        bson::{oid::ObjectId, DateTime},
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
    pub id: Option<String>,
    pub email: String,
    pub first_name: Option<String>,
    pub middle_name: Option<String>,
    pub last_name: Option<String>,
}

impl From<UserMutationInput> for User {
    fn from(input: UserMutationInput) -> Self {
        match input {
            UserMutationInput {
                id,
                email,
                first_name,
                last_name,
                middle_name,
            } => Self {
                id: match id {
                    Some(v) => Some(ObjectId::with_string(&v).unwrap()),
                    None => None,
                },
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
        }
    }
}

impl UserMutationInput {
    pub async fn save(self) -> FieldResult<UserNode> {
        let mut form = User::from(self);
        form.save(get_db().await?)
            .await
            .map_err(|e| Error(e.into()).extend())?;
        Ok(UserNode(form))
    }
}
