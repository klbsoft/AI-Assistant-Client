use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

use axum::{
    routing::{get, post},  // This is the METHOD from axum
    Router,
    Json,
    response::IntoResponse,
};

#[derive(Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn create_user(Json(payload): Json<CreateUser>) -> Json<User> {
    let user = User {
        id: 1,
        name: payload.name,
        email: payload.email,
    };
    Json(user)
}

async fn hello_world() -> &'static str {
    let conn = Connection::open("test.db").unwrap();
    conn.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER)", []).unwrap();
    "Hello, World!"
}

async fn health_check() -> &'static str {
    "OK"
}

async fn get_user() -> String {
    format!("User ID: 1")
}

// RENAME THIS FUNCTION - don't call it "post"
async fn test_post() -> String {  // Changed from "post" to "test_post"
    format!("message:working")
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(hello_world))
        .route("/health", get(health_check))
        .route("/user", get(get_user))
        .route("/create", post(create_user));  // This uses the IMPORTED post method

    let addr = "0.0.0.0:3000";
    println!("Server running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}