use crate::db::get_db;
use crate::{
    application::Application, error::ServiceError, organization::Organization, user::User,
};
use beatrix::{
    bson::{doc, oid::ObjectId},
    mongo::MongoModel,
};

mod session;
pub use session::Session;

pub async fn login(
    email: &str,
    password: &str,
    application_id: ObjectId,
) -> Result<(String, User, Application), ServiceError> {
    let user = find_user(email).await?;
    let user = user.verify_password(password).await?;
    let application = verify_application(application_id.clone(), &user.clone()).await?;
    let (token, _) = Session::new(
        email.into(),
        user.clone().id.unwrap(),
        application_id,
        match check_organization(&user, &application).await? {
            Some(v) => v.id,
            None => None,
        },
    )
    .await?;

    user.clone().login(chrono::Utc::now()).await?;
    Ok((token, user, application))
}

async fn find_user(email: &str) -> Result<User, ServiceError> {
    let user = User::find(get_db().await?, Some(doc! { "email": email }), None).await?;

    match user {
        None => Err(ServiceError::InvalidCredentials),
        Some(v) => Ok(v),
    }
}

async fn verify_application(
    application_id: ObjectId,
    user: &User,
) -> Result<Application, ServiceError> {
    let application =
        match Application::find(get_db().await?, doc! { "_id": application_id }, None).await {
            Ok(v) => match v {
                Some(v) => Ok(v),
                None => Err(ServiceError::Unauthorized("Application not found".into())),
            },
            Err(e) => Err(e.into()),
        }?;

    if match user
        .applications
        .clone()
        .unwrap_or(vec![])
        .iter()
        .find(|app| app.clone() == &application.id.clone().unwrap())
    {
        Some(_) => true,
        None => false,
    } {
        Ok(application)
    } else {
        Err(ServiceError::Unauthorized(
            "Access denied for application".into(),
        ))
    }
}

async fn check_organization(
    user: &User,
    application: &Application,
) -> Result<Option<Organization>, ServiceError> {
    if application.with_organization == false {
        return Ok(None);
    }

    if let Some(organization) = user.default_organization.clone() {
        return Ok(Organization::find(get_db().await?, doc! { "_id": organization }, None).await?);
    }

    Ok(Organization::find(
        get_db().await?,
        doc! { "users": user.id.clone().unwrap() },
        None,
    )
    .await?)
}
