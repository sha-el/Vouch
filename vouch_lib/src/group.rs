use beatrix::{
    beatrix_macro::MongoModel,
    bson::{doc, oid::ObjectId, DateTime as UtcDateTime},
    mongo::MongoModel,
    mongodb::options::FindOptions,
};
use futures::stream::StreamExt;
use serde::{self, Deserialize, Serialize};

use crate::{db::get_db, error::ServiceError, user::User};

#[derive(MongoModel, Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct Group {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub permissions: Vec<String>,
    pub features: Vec<String>,

    pub created_by_id: ObjectId,
    pub updated_at: UtcDateTime,
}

impl Group {
    pub async fn users(&self, options: Option<FindOptions>) -> Result<Vec<User>, ServiceError> {
        Ok(User::filter(
            get_db().await?,
            Some(doc!("groups": &self.id.clone().unwrap())),
            options,
        )
        .await?
        .collect::<Vec<_>>()
        .await
        .into_iter()
        .map(|v| v.unwrap())
        .collect())
    }
}
