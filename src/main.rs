use actix_cors::Cors;
use actix_files as fs;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_rt;
use actix_web::{middleware, App, HttpServer, web, Result};
use async_graphql::{EmptySubscription, Schema};

pub mod graphql;

async fn frontend_index() -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("./public/index.html")?)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    dotenv::dotenv().ok();

    let host = std::env::var("HOST").unwrap_or("127.0.0.1".to_string());
    let port = std::env::var("PORT").unwrap_or("3000".to_string());
    let workers = std::env::var("WORKERS")
        .unwrap_or("2".to_string())
        .parse::<usize>()
        .unwrap();

    println!("Starting {} workers on http://{}:{}", workers, host, port);
    let schema =
        Schema::build(graphql::QueryRoot, graphql::MutationRoot, EmptySubscription).finish();

    HttpServer::new(move || {
        App::new()
            .data(schema.clone())
            .wrap(
                Cors::default()
                    .allow_any_header()
                    // .allowed_origin(&std::env::var("ALLOWED_ORIGIN").expect("Allowed origin not set"))
                    .allow_any_origin()
                    .allow_any_method(),
            )
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&[0; 32])
                    .domain(std::env::var("DOMAIN").unwrap_or("localhost".to_string()))
                    .name("vouch-auth")
                    .secure(if std::env::var("SECURE").unwrap_or("0".into()) == "1" {
                        true
                    } else {
                        false
                    })
                    .http_only(true)
                    .path("/"),
            ))
            .wrap(middleware::Logger::default())
            .service(graphql::graphql)
            .service(graphql::gql_playground)
            .service(graphql::login)
            .service(graphql::logout)
            .service(fs::Files::new("/static", "./public/static").show_files_listing())
            .default_service(
                web::resource("")
                    .route(web::get().to(frontend_index))
            )
    })
    .bind(&format!("{}:{}", host, port))?
    .workers(workers)
    .run()
    .await
}
