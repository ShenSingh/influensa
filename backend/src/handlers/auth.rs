use axum::{extract::Json, response::IntoResponse, http::StatusCode};
use mongodb::bson::{doc};
use mongodb::Database;
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify};
use jsonwebtoken::{encode, EncodingKey, Header};
use std::env;

use crate::db::mongo_db;
use crate::models::user::User;

#[derive(Debug, Deserialize)]
pub struct SignupInput {
    pub user_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginInput {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
struct AuthResponse {
    pub token: String,
}

// ---------------- SIGNUP ----------------
pub async fn signup(Json(payload): Json<SignupInput>) -> impl IntoResponse {
    let db: Database = mongo_db::get_database().await;
    let users = db.collection::<User>("users");

    // Check if email already exists
    if let Ok(Some(_)) = users.find_one(doc! { "email": &payload.email }, None).await {
        return (StatusCode::BAD_REQUEST, Json("Email already exists".to_string()));
    }

    // Hash password
    let hashed_password = hash(&payload.password, 4).unwrap();

    let new_user = User {
        id: None,
        user_name: payload.user_name,
        email: payload.email,
        password: hashed_password,
        created_at: None,
    };

    users.insert_one(new_user, None).await.unwrap();

    (StatusCode::CREATED, Json("Signup successful".to_string()))
}

// ---------------- LOGIN ----------------
pub async fn login(Json(payload): Json<LoginInput>) -> impl IntoResponse {
    let db: Database = mongo_db::get_database().await;
    let users = db.collection::<User>("users");

    let user_opt = users
        .find_one(doc! { "email": &payload.email }, None)
        .await
        .unwrap();

    if let Some(user) = user_opt {
        let valid = verify(&payload.password, &user.password).unwrap();
        if valid {
            dotenvy::dotenv().ok();
            let secret = env::var("ACCESS_TOKEN_SECRET").expect("ACCESS_TOKEN_SECRET missing");

            // Create JWT
            let token = encode(
                &Header::default(),
                &serde_json::json!({
                    "id": user.id.unwrap().to_hex(),
                    "email": user.email
                }),
                &EncodingKey::from_secret(secret.as_bytes()),
            )
                .unwrap();

            return (StatusCode::OK, Json(AuthResponse { token }));
        }
    }

    (StatusCode::UNAUTHORIZED, Json(AuthResponse { token: "Invalid email or password".to_string() }))
}
