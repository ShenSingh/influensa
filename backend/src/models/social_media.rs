use serde::{Serialize, Deserialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct SocialMedia {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    pub influencer: ObjectId,

    pub platform: String, // "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Facebook"

    pub url: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub followers_count: Option<i64>,

    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<DateTime>,
}
