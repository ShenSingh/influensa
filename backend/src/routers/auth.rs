use axum::{Router, routing::post};
use crate::handlers::auth;

pub fn routes() -> Router {
    Router::new()
        .route("/signup", post(auth::signup))
        .route("/login", post(auth::login))
}
