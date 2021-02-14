mod validators;

use argon2::{self, verify_encoded, Config};
use beatrix::{
    beatrix_macro::MongoModel,
    bson::{oid::ObjectId, DateTime as UtcDateTime},
    mongo::MongoModel,
};
use chrono::{DateTime, Utc};
use serde::{self, Deserialize, Serialize};

use crate::{application::Application, db, error::ServiceError};

#[derive(MongoModel, Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub password: Option<String>,
    pub first_name: Option<String>,
    pub middle_name: Option<String>,
    pub last_name: Option<String>,
    pub applications: Option<Vec<ObjectId>>,
    pub last_login: Option<UtcDateTime>,
    pub permissions: Option<Vec<String>>,
    pub groups: Option<Vec<ObjectId>>,
    pub image: Option<String>,

    pub default_organization: Option<ObjectId>,

    pub updated_at: UtcDateTime,
}

impl User {
    pub async fn update_password(mut self, password: &str) -> Result<User, ServiceError> {
        let argon_config = Config::default();
        self.password = Some(
            argon2::hash_encoded(
                password.as_bytes(),
                self.id.clone().unwrap().to_string().as_bytes(),
                &argon_config,
            )
            .unwrap(),
        );

        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn validate(self) -> Result<User, ServiceError> {
        validators::verify_email(&self.email).await?;
        Ok(self)
    }

    pub async fn verify_password(self, password: &str) -> Result<User, ServiceError> {
        if let Ok(pass) = verify_encoded(self.password.as_ref().unwrap(), password.as_bytes()) {
            match pass {
                true => Ok(self),
                false => Err(ServiceError::InvalidCredentials),
            }
        } else {
            Err(ServiceError::InvalidCredentials)
        }
    }

    pub async fn add_application(mut self, application: Application) -> Result<User, ServiceError> {
        let mut applications = self.applications.unwrap_or(vec![]);
        applications.push(application.id.unwrap());
        self.applications = Some(applications);

        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn remove_application(
        mut self,
        application: Application,
    ) -> Result<User, ServiceError> {
        let mut applications = self.applications.unwrap_or(vec![]);

        applications
            .iter()
            .position(|v| v == &application.id.clone().unwrap())
            .map(|v| applications.remove(v));

        self.applications = Some(applications);

        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn add_permission(mut self, permissions: Vec<String>) -> Result<User, ServiceError> {
        self.permissions = Some(permissions);

        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn add_group(mut self, groups: Vec<ObjectId>) -> Result<User, ServiceError> {
        self.groups = Some(groups);
        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn add_image(mut self, image: String) -> Result<User, ServiceError> {
        self.image = Some(image);
        self.save(db::get_db().await?).await?;
        Ok(self)
    }

    pub async fn login(mut self, last_login: DateTime<Utc>) -> Result<User, ServiceError> {
        self.last_login = Some(UtcDateTime(last_login));
        self.save(db::get_db().await?).await?;
        Ok(self)
    }
}

// pub use model::{User, UserForm};
