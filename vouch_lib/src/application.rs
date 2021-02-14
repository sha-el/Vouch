use crate::db::get_db;
use crate::{error::ServiceError, user::User};
use beatrix::{
    beatrix_macro::MongoModel,
    bson::{doc, oid::ObjectId, DateTime as UtcDateTime},
    mongo::MongoModel,
    mongodb::options::FindOptions,
};
use futures::stream::StreamExt;
use serde::{self, Deserialize, Serialize};

#[derive(Serialize, Deserialize, MongoModel, Debug, Clone, PartialEq, Eq)]
pub struct Application {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub with_organization: bool,
    pub features: Vec<String>,
    pub permissions: Vec<String>,
    pub redirect_url: String,

    pub updated_at: UtcDateTime,
}

impl Application {
    pub async fn users(&self, options: Option<FindOptions>) -> Result<Vec<User>, ServiceError> {
        Ok(User::filter(
            get_db().await?,
            Some(doc! {"applications": { "_id": &self.id.clone().unwrap() }}),
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
