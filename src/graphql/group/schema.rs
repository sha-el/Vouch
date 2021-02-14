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
    group::Group,
    user::User,
};

use super::interface::{GroupEdge, GroupNode};
use crate::graphql::{user::UserNode, Error};

#[Object]
impl GroupNode {
    async fn id(&self) -> ObjectId {
        self.0.id.clone().unwrap()
    }

    async fn name(&self) -> String {
        self.0.name.clone()
    }

    async fn permissions(&self) -> Vec<String> {
        self.0.permissions.clone()
    }

    async fn features(&self) -> Vec<String> {
        self.0.features.clone()
    }

    async fn created_by_id(&self) -> String {
        self.0.created_by_id.to_string()
    }

    async fn created_by(&self) -> FieldResult<UserNode> {
        Ok(UserNode(
            User::find(get_db().await?, doc! { "_id": &self.0.created_by_id }, None)
                .await
                .map_err(|e| Error(e.into()).extend())?
                .unwrap(),
        ))
    }

    async fn updated_at(&self) -> DateTime<Utc> {
        self.0.updated_at.0
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
impl GroupEdge {
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

    pub async fn edges(&self) -> FieldResult<Vec<GroupNode>> {
        Ok(Group::filter(
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
        .map(|v| GroupNode(v.unwrap().clone()))
        .collect())
    }

    pub async fn count(&self) -> FieldResult<i64> {
        Ok(Group::count(get_db().await?, Some(self.filters()), None)
            .await
            .map_err(|e| Error(e.into()).extend())?)
    }
}
