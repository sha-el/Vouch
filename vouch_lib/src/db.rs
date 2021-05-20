use beatrix::mongodb::{options::ClientOptions, Client, Collection, Database};

use crate::error::ServiceError;

pub async fn get_db() -> Result<Database, ServiceError> {
    let db_host = std::env::var("DB_HOST").expect("No DB_HOST url set");
    let db_name = std::env::var("DB_NAME").expect("NO DB_NAME set");

    let client_options = ClientOptions::parse(&db_host).await?;
    let client = Client::with_options(client_options)?;

    Ok(client.database(&db_name))
}

pub async fn get_collection(collection_name: &str) -> Result<Collection, ServiceError> {
    Ok(get_db().await?.collection(collection_name))
}
