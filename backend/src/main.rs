mod db;
mod handlers;
mod models;
mod routers;

use db::mongo_db;
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    // Connect to MongoDB
    mongo_db::get_database().await;

    let app = routers::create_routes();

    let addr = SocketAddr::from(([0,0,0,0], 3001));
    println!("🚀 Server running at https://{}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();

}