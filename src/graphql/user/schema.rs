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
    user::User,
};

use super::interface::{UserEdge, UserNode};
use crate::graphql::{
    application::ApplicationEdge,
    group::GroupEdge,
    organization::{OrganizationEdge, OrganizationNode},
    Error,
};

#[Object]
impl UserNode {
    async fn id(&self) -> ObjectId {
        self.0.id.clone().unwrap()
    }
    async fn email(&self) -> String {
        self.0.email.clone()
    }
    async fn first_name(&self) -> Option<String> {
        self.0.first_name.clone()
    }
    async fn middle_name(&self) -> Option<String> {
        self.0.middle_name.clone()
    }
    async fn last_name(&self) -> Option<String> {
        self.0.last_name.clone()
    }
    async fn applications(&self) -> Vec<ObjectId> {
        self.0
            .applications
            .clone()
            .unwrap_or(vec![])
            .into_iter()
            .collect()
    }
    async fn application_edge(&self) -> FieldResult<ApplicationEdge> {
        Ok(ApplicationEdge {
            first: None,
            offset: None,
            name_i_contains: None,
            ids: Some(
                self.0
                    .applications
                    .clone()
                    .unwrap_or(vec![])
                    .into_iter()
                    .collect(),
            ),
        })
    }
    async fn last_login(&self) -> Option<DateTime<Utc>> {
        match self.0.last_login {
            Some(v) => Some(v.0),
            None => None,
        }
    }
    async fn permissions(&self) -> Vec<String> {
        self.0.permissions.clone().unwrap_or(vec![])
    }
    async fn groups(&self) -> Vec<String> {
        self.0
            .groups
            .clone()
            .unwrap_or(vec![])
            .iter()
            .map(|v| v.to_string())
            .collect()
    }
    async fn groups_edge(
        &self,
        first: Option<i64>,
        offset: Option<i64>,
        name_i_contains: Option<String>,
    ) -> FieldResult<GroupEdge> {
        Ok(GroupEdge {
            first,
            offset,
            name_i_contains,
            ids: Some(self.0.groups.clone().unwrap_or(vec![])),
        })
    }
    async fn image(&self) -> Option<String> {
        self.0.image.clone()
    }

    async fn default_organization(&self) -> FieldResult<Option<OrganizationNode>> {
        match self.0.default_organization.clone() {
            Some(v) => Ok(OrganizationNode::find(doc! { "_id": v }).await?),
            None => Ok(None),
        }
    }

    async fn organization_edge(
        &self,
        first: Option<i64>,
        offset: Option<i64>,
        name_i_contains: Option<String>,
    ) -> FieldResult<OrganizationEdge> {
        Ok(OrganizationEdge {
            first,
            offset,
            name_i_contains,
            user_id: self.0.id.clone(),
        })
    }

    async fn updated_at(&self) -> DateTime<Utc> {
        self.0.updated_at.0
    }
}

#[Object]
impl UserEdge {
    #[graphql(skip)]
    fn filters(&self) -> Document {
        let mut filter_doc = doc! {
                "email": Regex{
                    pattern: self.email_i_contains.clone().unwrap_or(String::from("")),
                    options: "i".into()
                },
        };

        if let Some(ids) = self.ids.as_ref() {
            filter_doc.insert("_id", doc! { "$in": ids });
        }

        filter_doc
    }

    pub async fn edges(&self) -> FieldResult<Vec<UserNode>> {
        Ok(User::filter(
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
        .map(|v| UserNode(v.unwrap().clone()))
        .collect())
    }

    pub async fn count(&self) -> FieldResult<i64> {
        Ok(User::count(
            get_db().await?,
            Some(doc! {
                    "email": Regex{
                        pattern: self.email_i_contains.clone().unwrap_or(String::from("")),
                        options: "i".into()
                    },
            }),
            None,
        )
        .await
        .map_err(|e| Error(e.into()).extend())?)
    }
}
