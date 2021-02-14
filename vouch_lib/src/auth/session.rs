use beatrix::{
    beatrix_macro::MongoModel,
    bson::{doc, oid::ObjectId},
    mongo::MongoModel,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::{db::get_db, error::ServiceError, user::User};

#[derive(MongoModel, Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct Session {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    email: String,
    exp: i64,
    iat: i64,
    pub aud: ObjectId,
    pub application: ObjectId,
    pub org: Option<ObjectId>,
}

impl Session {
    pub async fn new(
        email: String,
        aud: ObjectId,
        application: ObjectId,
        org: Option<ObjectId>,
    ) -> Result<(String, Self), ServiceError> {
        let mut session = Session {
            id: None,
            email,
            exp: (Utc::now() + Duration::hours(12)).timestamp(),
            iat: Utc::now().timestamp(),
            aud,
            org,
            application,
        };

        let token = encode(
            &Header::default(),
            &session,
            &EncodingKey::from_secret(std::env::var("JWT_KEY").expect("JWT KEY not set").as_ref()),
        )?;
        session.save(get_db().await?).await?;

        Ok((token, session))
    }

    pub async fn get_user(&self) -> Result<User, ServiceError> {
        Ok(
            User::find(get_db().await?, Some(doc! {"email" : &self.email}), None)
                .await?
                .unwrap(),
        )
    }

    pub fn default() -> Self {
        Session {
            id: Some(ObjectId::new()),
            email: "anit.nilay20@gmail.com".into(),
            exp: (Utc::now() + Duration::hours(12)).timestamp(),
            iat: Utc::now().timestamp(),
            aud: ObjectId::new(),
            application: ObjectId::new(),
            org: None,
        }
    }
}
