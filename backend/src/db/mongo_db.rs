use mongodb::{Client, Database};
use dotenvy::dotenv;
use std::env;

pub async fn get_database() -> Database {
    // Load .env
    dotenv().ok();

    // Read MongoDB URL
    let db_url = env::var("DB_URL").expect("DB_URL must be set in .env");
    let db_name = env::var("DB_NAME").unwrap_or_else(|_| "influ_db".to_string());

    // Connect to MongoDB
    let client = Client::with_uri_str(db_url.as_str())
        .await
        .expect("Failed to connect to MongoDB");

    println!("✅ Connected to MongoDB: {}", db_name);
    client.database(&db_name)
}
