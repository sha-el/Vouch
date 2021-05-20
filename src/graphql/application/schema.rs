use async_graphql::{ErrorExtensions, FieldResult, Object};
use chrono::{DateTime, Utc};
use vouch_lib::{
    application::Application,
    beatrix::{
        bson::{doc, oid::ObjectId, Document, Regex},
        mongo::MongoModel,
        mongodb::options::FindOptions,
    },
    db::get_db,
    futures::StreamExt,
};

use super::interface::{ApplicationEdge, ApplicationNode};
use crate::graphql::{user::UserNode, Error};

#[Object]
impl ApplicationNode {
    async fn id(&self) -> ObjectId {
        self.0.id.clone().unwrap()
    }

    async fn name(&self) -> String {
        self.0.name.clone()
    }

    async fn with_organization(&self) -> bool {
        self.0.with_organization
    }

    async fn updated_at(&self) -> DateTime<Utc> {
        self.0.updated_at.0
    }

    async fn features(&self) -> Vec<String> {
        self.0.features.clone()
    }

    async fn permissions(&self) -> Vec<String> {
        self.0.permissions.clone()
    }

    async fn redirect_url(&self) -> String {
        self.0.redirect_url.clone()
    }

    async fn users(&self) -> FieldResult<Vec<UserNode>> {
        Ok(self
            .0
            .users(None)
            .await
            .map_err(|e| Error(e).extend())?
            .iter()
            .map(|v| UserNode(v.clone()))
            .collect())
    }
}

#[Object]
impl ApplicationEdge {
    #[graphql(skip)]
    fn filters(&self) -> Document {
        let mut filter_doc = doc! {
                "name": Regex{
                    pattern: self.name_i_contains.clone().unwrap_or(String::from("")),
                    options: "i".into()
                },
        };

        if let Some(ids) = self.ids.as_ref() {
            filter_doc.insert("_id", doc! { "$in": ids });
        }

        filter_doc
    }

    pub async fn edges(&self) -> FieldResult<Vec<ApplicationNode>> {
        Ok(Application::filter(
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
        .map(|v| ApplicationNode(v.unwrap().clone()))
        .collect())
    }

    pub async fn count(&self) -> FieldResult<i64> {
        Ok(
            Application::count(get_db().await?, Some(self.filters()), None)
                .await
                .map_err(|e| Error(e.into()).extend())?,
        )
    }
}
