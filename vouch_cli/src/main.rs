use serde::{Deserialize, Serialize};
use vouch_lib::{
    application::Application, beatrix::mongo::MongoModel, db::get_db, organization::Organization,
    user::User,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Fixtures {
    user: Vec<User>,
    application: Vec<Application>,
    organization: Vec<Organization>,
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let file = std::fs::read_to_string("fixtures.json").unwrap();
    let data: Fixtures = serde_json::from_str(&file).unwrap();
    let db = get_db().await.unwrap();

    for mut user in data.clone().user.into_iter() {
        user.save(db.clone()).await.unwrap();
    }

    for mut app in data.clone().application.into_iter() {
        app.save(db.clone()).await.unwrap();
    }

    for mut org in data.clone().organization.into_iter() {
        org.save(db.clone()).await.unwrap();
    }

    Ok(())
}
