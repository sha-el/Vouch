use async_graphql::{ErrorExtensions, FieldResult, InputObject};
use vouch_lib::{
    beatrix::{
        bson::{oid::ObjectId, DateTime, Document},
        mongo::MongoModel,
    },
    db::get_db,
    organization::Organization,
};

use crate::graphql::Error;

pub struct OrganizationEdge {
    pub first: Option<i64>,
    pub offset: Option<i64>,
    pub name_i_contains: Option<String>,
    pub user_id: Option<ObjectId>,
}

pub struct OrganizationNode(pub Organization);

#[derive(InputObject)]
pub struct OrganizationMutationInput {
    pub id: Option<String>,
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
}

impl From<OrganizationMutationInput> for Organization {
    fn from(input: OrganizationMutationInput) -> Self {
        match input {
            OrganizationMutationInput {
                id,
                name,
                address,
                contact,
                gst_code,
                gst_rate,
                hsn_code,
                amt_per_point_sale,
                amt_ready,
                users,
                features,
            } => Self {
                id: match id {
                    Some(v) => Some(ObjectId::with_string(&v).unwrap()),
                    None => None,
                },
                name,
                address,
                contact,
                gst_code,
                gst_rate,
                hsn_code,
                amt_per_point_sale,
                amt_ready,
                users,
                features,
                updated_at: DateTime(chrono::Utc::now()),
            },
        }
    }
}

impl OrganizationMutationInput {
    pub async fn save(self) -> FieldResult<OrganizationNode> {
        let mut form = Organization::from(self);
        form.save(get_db().await?)
            .await
            .map_err(|e| Error(e.into()).extend())?;
        Ok(OrganizationNode(form))
    }
}

impl OrganizationNode {
    pub async fn find(filter: Document) -> FieldResult<Option<Self>> {
        match Organization::find(get_db().await?, filter, None)
            .await
            .map_err(|e| Error(e.into()).extend())?
        {
            Some(v) => Ok(Some(Self(v))),
            None => Ok(None),
        }
    }
}
