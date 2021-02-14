use async_graphql::{ErrorExtensions, FieldResult, Object};
use chrono::{DateTime, Utc};
use vouch_lib::{
    beatrix::{
        bson::{doc, oid::ObjectId, Document, Regex},
        mongo::MongoModel,
        mongodb::options::FindOptions,
    },
    db::get_db,
    futures::StreamExt,
    organization::Organization,
};

use super::interface::{OrganizationEdge, OrganizationNode};
use crate::graphql::{user::UserEdge, Error};

#[Object]
impl OrganizationNode {
    async fn id(&self) -> ObjectId {
        self.0.id.clone().unwrap()
    }
    async fn name(&self) -> String {
        self.0.name.clone()
    }
    async fn address(&self) -> Option<String> {
        self.0.address.clone()
    }
    async fn contact(&self) -> Option<String> {
        self.0.contact.clone()
    }
    async fn gst_code(&self) -> Option<String> {
        self.0.gst_code.clone()
    }
    async fn gst_rate(&self) -> Option<String> {
        self.0.gst_rate.clone()
    }
    async fn hsn_code(&self) -> Option<String> {
        self.0.hsn_code.clone()
    }
    async fn amt_per_point_sale(&self) -> Option<String> {
        self.0.amt_per_point_sale.clone()
    }
    async fn amt_ready(&self) -> Option<String> {
        self.0.amt_ready.clone()
    }
    async fn features(&self) -> Vec<String> {
        self.0.features.clone().unwrap_or(vec![])
    }
    async fn users(&self) -> Option<Vec<ObjectId>> {
        self.0.users.clone()
    }
    async fn user_edge(
        &self,
        first: Option<i64>,
        offset: Option<i64>,
        email_i_contains: Option<String>,
    ) -> FieldResult<UserEdge> {
        Ok(UserEdge {
            first,
            offset,
            email_i_contains,
            ids: self.0.users.clone(),
        })
    }
    async fn updated_at(&self) -> DateTime<Utc> {
        self.0.updated_at.0
    }
}

#[Object]
impl OrganizationEdge {
    #[graphql(skip)]
    pub fn filters(&self) -> Document {
        let filter_doc = doc! {
                "name": Regex{
                    pattern: self.name_i_contains.clone().unwrap_or(String::from("")),
                    options: "i".into()
                },
        };

        filter_doc
    }
    pub async fn edges(&self) -> FieldResult<Vec<OrganizationNode>> {
        Ok(Organization::filter(
            get_db().await?,
            Some(self.filters()),
            Some(
                FindOptions::builder()
                    .limit(self.first)
                    .skip(self.offset)
                    .build(),
            ),
        )
        .await
        .map_err(|e| Error(e.into()).extend())?
        .collect::<Vec<_>>()
        .await
        .into_iter()
        .map(|v| OrganizationNode(v.unwrap().clone()))
        .collect())
    }

    pub async fn count(&self) -> FieldResult<i64> {
        Ok(Organization::count(
            get_db().await?,
            Some(self.filters()),
            None,
        )
        .await
        .map_err(|e| Error(e.into()).extend())?)
    }
}
