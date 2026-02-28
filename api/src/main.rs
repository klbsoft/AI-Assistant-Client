mod identity;
mod components;

use chrono::NaiveDateTime;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};


use axum::{
    routing::{get, post},  // This is the METHOD from axum
    Router,
    Json,
    response::IntoResponse,
};
use crate::identity::users::User;
use crate::components::dbfactory::Sqlitedb;


async fn create_user(Json(payload): Json<User>) -> Json<User> {
    let user = User {
        id:1,
        username:payload.username,
        salt:payload.salt,
        created_at:payload.created_at,
        email:payload.email,
        password_hash:payload.password_hash,
        updated_at:NaiveDateTime::from_timestamp_opt(1609459200, 0).unwrap()
    };
    Json(user)
}

fn test_end_point() -> String{

    let db = Sqlitedb::new("test.db","scheme.sql");
     db.debug_dump();
    return "Working...".to_string();
}
 
 

#[tokio::main]
async fn main() {

    let app = Router::new()
        .route("/", get(test_end_point()))
        .route("/login", post(create_user))
        .route("/singup", post(create_user));  


    let addr = "0.0.0.0:3000";
    println!("Server running on http://{}", addr);  
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}