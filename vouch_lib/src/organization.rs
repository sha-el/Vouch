use crate::{db, error::ServiceError};
use beatrix::{
    beatrix_macro::MongoModel,
    bson::{oid::ObjectId, DateTime as UtcDateTime},
    mongo::MongoModel,
};
use serde::{self, Deserialize, Serialize};

#[derive(MongoModel, Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct Organization {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub address: Option<String>,
    pub contact: Option<String>,
    pub gst_code: Option<String>,
    pub gst_rate: Option<String>,
    pub hsn_code: Option<String>,
    pub amt_per_point_sale: Option<String>,
    pub amt_ready: Option<String>,
    pub users: Option<Vec<ObjectId>>,
    pub features: Option<Vec<String>>,
    pub updated_at: UtcDateTime,
}

impl Organization {
    pub async fn add_users(mut self, users: Vec<ObjectId>) -> Result<Organization, ServiceError> {
        self.users = Some(users);
        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn add_features(
        mut self,
        features: Vec<String>,
    ) -> Result<Organization, ServiceError> {
        self.features = Some(features);
        self.save(db::get_db().await?).await?;
        Ok(self)
    }
}
