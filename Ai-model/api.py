from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = FastAPI(title="Influencer Recommendation API", version="1.0.0")

class RecommendationRequest(BaseModel):
    business_description: str
    top_n: Optional[int] = 5
    data_file_path: Optional[str] = 'data/combined_preprocessed_influencer_data.csv'

class InfluencerRecommendation(BaseModel):
    username: str
    similarity_score: float
    avg_likes: float
    avg_comments: float

class InfluencerScore(BaseModel):
    username: str
    score: float
    avg_likes: float
    total_likes: int
    post_count: int
    total_comments: int
    avg_comments: float

class InfluencerScoreResponse(BaseModel):
    success: bool
    message: str
    influencer_data: Optional[InfluencerScore] = None

class RecommendationResponse(BaseModel):
    success: bool
    message: str
    recommendations: Optional[list[InfluencerRecommendation]] = None

# --- Helper function for text cleaning ---
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# --- Recommendation function ---
def recommend_influencers(user_business_description, data_file_path='data/combined_preprocessed_influencer_data.csv', top_n=5):
    try:
        # Load the preprocessed data
        df = pd.read_csv(data_file_path)

        # Ensure 'cleaned_caption' and 'cleaned_hashtags' columns exist and are string type
        for col in ['cleaned_caption', 'cleaned_hashtags']:
            if col not in df.columns:
                raise ValueError(f"Required column '{col}' not found in the preprocessed data.")
            df[col] = df[col].astype(str).fillna("")

        # Combine relevant text columns for each post.
        df['combined_post_text'] = df['cleaned_caption'] + " " + df['cleaned_hashtags']

        # Group by username to get a single, comprehensive text representation for each influencer.
        influencer_content = df.groupby('username')['combined_post_text'].apply(lambda x: " ".join(x)).reset_index()
        influencer_content.rename(columns={'combined_post_text': 'influencer_profile_text'}, inplace=True)

        # Calculate average likes and comments for each influencer (engagement metrics)
        influencer_engagement = df.groupby('username')[['likes', 'comments']].mean().reset_index()
        influencer_engagement.rename(columns={'likes': 'avg_likes', 'comments': 'avg_comments'}, inplace=True)

        # Merge content and engagement data into a single DataFrame for influencers
        influencers_df = pd.merge(influencer_content, influencer_engagement, on='username', how='left')

        # --- IMPROVED TF-IDF Vectorization ---
        # Use better parameters for more meaningful similarity scores
        tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=10000,  # Increased vocabulary
            min_df=1,            # Include words that appear at least once
            max_df=0.95,         # Exclude very common words
            ngram_range=(1, 2),  # Include unigrams and bigrams
            sublinear_tf=True    # Apply sublinear tf scaling
        )

        # Clean and expand user business description for better matching
        expanded_description = expand_business_description(user_business_description)

        # Fit the vectorizer on all influencer profile texts and the expanded user description
        all_texts_for_tfidf = influencers_df['influencer_profile_text'].tolist() + [expanded_description]
        tfidf_vectorizer.fit(all_texts_for_tfidf)

        # Transform the influencer profile texts and the user's business description into TF-IDF vectors.
        influencer_tfidf_matrix = tfidf_vectorizer.transform(influencers_df['influencer_profile_text'])
        user_tfidf_vector = tfidf_vectorizer.transform([expanded_description])

        # --- Enhanced Cosine Similarity Calculation ---
        cosine_similarities = cosine_similarity(user_tfidf_vector, influencer_tfidf_matrix).flatten()

        # Normalize similarity scores to 0-1 range for better interpretation
        if cosine_similarities.max() > 0:
            normalized_similarities = (cosine_similarities - cosine_similarities.min()) / (cosine_similarities.max() - cosine_similarities.min())
        else:
            normalized_similarities = cosine_similarities

        influencers_df['similarity_score'] = cosine_similarities
        influencers_df['normalized_similarity'] = normalized_similarities

        # Add engagement weight to improve recommendations
        # Normalize engagement metrics
        if influencers_df['avg_likes'].max() > 0:
            influencers_df['engagement_score'] = (
                0.7 * (influencers_df['avg_likes'] / influencers_df['avg_likes'].max()) +
                0.3 * (influencers_df['avg_comments'] / influencers_df['avg_comments'].max())
            )
        else:
            influencers_df['engagement_score'] = 0

        # Combined score: 70% similarity + 30% engagement
        influencers_df['final_score'] = (
            0.7 * influencers_df['normalized_similarity'] +
            0.3 * influencers_df['engagement_score']
        )

        # --- Recommendation ---
        recommended_influencers = influencers_df.sort_values(by='final_score', ascending=False)

        # Return with original similarity score but sorted by final_score
        return recommended_influencers.head(top_n)

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data file '{data_file_path}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during recommendation: {str(e)}")

def expand_business_description(description):
    """Expand business description with related terms for better matching"""

    # Define keyword mappings for better matching
    expansion_map = {
        'fashion': ['style', 'clothing', 'apparel', 'outfit', 'wear', 'design', 'trend', 'clothes'],
        'sustainable': ['eco', 'green', 'organic', 'natural', 'environment', 'ethical', 'conscious'],
        'beauty': ['makeup', 'cosmetics', 'skincare', 'glow', 'skin', 'beauty', 'treatment'],
        'food': ['restaurant', 'cuisine', 'meal', 'cooking', 'recipe', 'eat', 'dining', 'taste'],
        'fitness': ['workout', 'exercise', 'gym', 'health', 'training', 'sport', 'active'],
        'tech': ['technology', 'app', 'digital', 'software', 'innovation', 'gadget'],
        'travel': ['tourism', 'vacation', 'trip', 'destination', 'journey', 'adventure'],
        'lifestyle': ['living', 'daily', 'routine', 'life', 'personal', 'home', 'family']
    }

    expanded_terms = [description.lower()]

    # Add related terms based on keywords found in description
    for key, related_terms in expansion_map.items():
        if key in description.lower():
            expanded_terms.extend(related_terms)

    # Add specific demographic terms
    if any(term in description.lower() for term in ['young', 'women', 'female', 'girl']):
        expanded_terms.extend(['women', 'female', 'girl', 'lady', 'feminine'])

    if any(term in description.lower() for term in ['luxury', 'premium', 'high-end']):
        expanded_terms.extend(['luxury', 'premium', 'expensive', 'high-end', 'exclusive'])

    return ' '.join(expanded_terms)

@app.get("/")
async def root():
    return {"message": "Influencer Recommendation API", "version": "1.0.0"}

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get influencer recommendations based on business description
    """
    try:
        recommended_df = recommend_influencers(
            user_business_description=request.business_description,
            data_file_path=request.data_file_path,
            top_n=request.top_n
        )

        if recommended_df is not None and not recommended_df.empty:
            recommendations = [
                InfluencerRecommendation(
                    username=row['username'],
                    similarity_score=float(row['similarity_score']),
                    avg_likes=float(row['avg_likes']),
                    avg_comments=float(row['avg_comments'])
                )
                for _, row in recommended_df.iterrows()
            ]

            return RecommendationResponse(
                success=True,
                message=f"Found {len(recommendations)} recommendations",
                recommendations=recommendations
            )
        else:
            return RecommendationResponse(
                success=True,
                message="No recommendations found for the given description",
                recommendations=[]
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.get("/getScoreByInfluencer", response_model=InfluencerScoreResponse)
async def get_score_by_influencer_score(influencer_name: str = Query(..., description="Username of the influencer to get score for")):
    """
    Get score and statistics for a specific influencer by username
    """
    try:
        # Load the influencer scores CSV file
        df = pd.read_csv('data/influencer_scores.csv')

        # Filter for the specific influencer (case-insensitive search)
        influencer_data = df[df['username'].str.lower() == influencer_name.lower()]

        if influencer_data.empty:
            return InfluencerScoreResponse(
                success=False,
                message=f"Influencer '{influencer_name}' not found in the dataset",
                influencer_data=None
            )

        # Extract the data for the influencer
        row = influencer_data.iloc[0]

        # Create the influencer score object
        influencer_score = InfluencerScore(
            username=row['username'],
            score=float(row['score']),
            avg_likes=float(row['avg_likes']),
            total_likes=int(row['total_likes']),
            post_count=int(row['post_count']),
            total_comments=int(row['total_comments']),
            avg_comments=float(row['avg_comments'])
        )

        return InfluencerScoreResponse(
            success=True,
            message=f"Successfully retrieved data for @{row['username']}",
            influencer_data=influencer_score
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Influencer scores data file not found. Please ensure the data has been processed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while retrieving influencer data: {str(e)}")