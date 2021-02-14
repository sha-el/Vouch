use async_graphql::{ErrorExtensions, FieldResult, InputObject};
use vouch_lib::{
    application::Application,
    beatrix::{
        bson::{oid::ObjectId, DateTime},
        mongo::MongoModel,
    },
    db::get_db,
};

use crate::graphql::Error;

pub struct ApplicationEdge {
    pub first: Option<i64>,
    pub offset: Option<i64>,
    pub name_i_contains: Option<String>,
    pub ids: Option<Vec<ObjectId>>,
}

pub struct ApplicationNode(pub Application);

#[derive(InputObject)]
pub struct ApplicationMutationInput {
    // TODO: Add validations.
    // #[validate(StringMinLength(value = "12"), StringMaxLength(value = "12"))]
    pub id: Option<String>,
    pub name: String,
    pub with_organization: bool,
    pub features: Vec<String>,
    pub permissions: Vec<String>,
    pub redirect_url: String,
}

impl From<ApplicationMutationInput> for Application {
    fn from(input: ApplicationMutationInput) -> Self {
        match input {
            ApplicationMutationInput {
                id,
                name,
                with_organization,
                features,
                permissions,
                redirect_url,
            } => Self {
                id: match id {
                    Some(v) => Some(ObjectId::with_string(&v).unwrap()),
                    None => None,
                },
                name,
                with_organization,
                features,
                permissions,
                redirect_url,
                updated_at: DateTime(chrono::Utc::now()),
            },
        }
    }
}

impl ApplicationMutationInput {
    pub async fn save(self) -> FieldResult<ApplicationNode> {
        let mut form = Application::from(self);
        form.save(get_db().await?)
            .await
            .map_err(|e| Error(e.into()).extend())?;
        Ok(ApplicationNode(form))
    }
}
