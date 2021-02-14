use beatrix::{bson::doc, mongo::MongoModel};
use futures::stream::StreamExt;
use regex::Regex;

use super::User;
use crate::{db::get_db, error::ServiceError};

pub async fn verify_email(email: &str) -> Result<(), ServiceError> {
    unique_email(email).await?;
    valid_email(email).await?;
    Ok(())
}

async fn unique_email(email: &str) -> Result<(), ServiceError> {
    match User::filter(get_db().await?, Some(doc! { "email": email }), None)
        .await?
        .collect::<Vec<_>>()
        .await
        .len()
    {
        0 => Ok(()),
        _ => Err(ServiceError::BadRequest("Email already exists".into())),
    }
}

async fn valid_email(email: &str) -> Result<(), ServiceError> {
    let re = Regex::new(r"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").unwrap();
    println!("{:?}:{}", re.is_match(email), email);
    match re.is_match(email) {
        true => Ok(()),
        false => Err(ServiceError::BadRequest("Invalid Email".into())),
    }
}
