use beatrix::{
    bson::{from_bson, to_bson, Bson, Document},
    mongodb::{options::ClientOptions, Client, Collection, Database},
};
use serde::{Deserialize, Serialize};

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

pub fn decode<T: Deserialize<'static>>(doc: &Document) -> Option<T>
where
    T: std::fmt::Debug,
{
    from_bson(Bson::Document(doc.clone())).ok()
}

pub fn encode<T: Serialize>(doc: &T) -> Option<Document> {
    match to_bson(doc) {
        Ok(Bson::Document(d)) => Some(d),
        _ => None,
    }
}

pub fn merge_docs(new_doc: &Document, old_doc: &mut Document) {
    new_doc.iter().for_each(|(key, value)| {
        old_doc.insert(key, value);
    })
}
