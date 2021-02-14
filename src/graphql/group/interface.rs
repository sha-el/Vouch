use async_graphql::{ErrorExtensions, FieldResult, InputObject};
use vouch_lib::{
    beatrix::{
        bson::{oid::ObjectId, DateTime},
        mongo::MongoModel,
    },
    db::get_db,
    group::Group,
};

use crate::graphql::Error;

pub struct GroupEdge {
    pub first: Option<i64>,
    pub offset: Option<i64>,
    pub name_i_contains: Option<String>,
    pub ids: Option<Vec<ObjectId>>,
}

pub struct GroupNode(pub Group);

#[derive(InputObject)]
pub struct GroupMutationInput {
    // TODO: Add validations.
    // #[validate(StringMinLength(value = "12"), StringMaxLength(value = "12"))]
    pub id: Option<String>,
    pub name: String,
    pub permissions: Vec<String>,
    pub features: Vec<String>,
}

impl From<GroupMutationInput> for Group {
    fn from(input: GroupMutationInput) -> Self {
        match input {
            GroupMutationInput {
                id,
                name,
                permissions,
                features,
            } => Self {
                id: match id {
                    Some(v) => Some(ObjectId::with_string(&v).unwrap()),
                    None => None,
                },
                name,
                permissions,
                features,
                updated_at: DateTime(chrono::Utc::now()),
                created_by_id: ObjectId::new(),
            },
        }
    }
}

impl GroupMutationInput {
    pub async fn save(self, user_id: ObjectId) -> FieldResult<GroupNode> {
        let mut form = Group::from(self);
        form.created_by_id = user_id;
        form.save(get_db().await?)
            .await
            .map_err(|e| Error(e.into()).extend())?;
        Ok(GroupNode(form))
    }
}
