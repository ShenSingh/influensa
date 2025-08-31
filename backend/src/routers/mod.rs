pub mod auth;

use axum::Router;

pub fn create_routes() -> Router {
    Router::new()
        .nest("/auth", auth::routes())
}
