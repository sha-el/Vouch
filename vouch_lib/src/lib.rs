pub mod application;
pub mod auth;
pub mod db;
pub mod error;
pub mod group;
pub mod organization;
pub mod user;

pub use beatrix;
pub use futures;
pub use jsonwebtoken;

pub async fn test_setup() {
    dotenv::from_filename(".env.test").ok();
    let db = db::get_db().await.unwrap();

    for collection_name in db.list_collection_names(None).await.unwrap() {
        db.collection(&collection_name).drop(None).await.unwrap();
    }
}
