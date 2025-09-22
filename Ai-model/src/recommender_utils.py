import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re  # Needed if clean_text is not imported separately

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def recommend_influencers(user_business_description, data_file_path='../data/combined_preprocessed_influencer_data.csv',
                          top_n=5):
    try:
        # Load the preprocessed data
        df = pd.read_csv(data_file_path)
        print(f"Loaded preprocessed data from {data_file_path}. Shape: {df.shape}")

        # Ensure 'cleaned_caption' and 'cleaned_hashtags' columns exist and are string type
        # These columns should already be cleaned from the preprocessing step (Step 3).
        for col in ['cleaned_caption', 'cleaned_hashtags']:
            if col not in df.columns:
                print(
                    f"Error: Required column '{col}' not found in the preprocessed data. Please ensure preprocessing was successful.")
                return None
            df[col] = df[col].astype(str).fillna("")

        # Combine relevant text columns for each post.
        # It's crucial that 'cleaned_caption' and 'cleaned_hashtags' are used here.
        df['combined_post_text'] = df['cleaned_caption'] + " " + df['cleaned_hashtags']

        # Group by username to get a single, comprehensive text representation for each influencer.
        # This aggregates all their posts' text into one string per influencer.
        influencer_content = df.groupby('username')['combined_post_text'].apply(lambda x: " ".join(x)).reset_index()
        influencer_content.rename(columns={'combined_post_text': 'influencer_profile_text'}, inplace=True)
        print(f"Aggregated content for {len(influencer_content)} unique influencers.")

        # Calculate average likes and comments for each influencer (engagement metrics)
        influencer_engagement = df.groupby('username')[['likes', 'comments']].mean().reset_index()
        influencer_engagement.rename(columns={'likes': 'avg_likes', 'comments': 'avg_comments'}, inplace=True)

        # Merge content and engagement data into a single DataFrame for influencers
        influencers_df = pd.merge(influencer_content, influencer_engagement, on='username', how='left')
        print("Influencer profiles (aggregated text & avg engagement) created.")

        # --- TF-IDF Vectorization ---
        print("\nStarting TF-IDF Vectorization...")
        tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)

        # Fit the vectorizer on all influencer profile texts and the user's business description.
        # This step builds the vocabulary and calculates the IDF values across all relevant documents.
        all_texts_for_tfidf = influencers_df['influencer_profile_text'].tolist() + [user_business_description]
        tfidf_vectorizer.fit(all_texts_for_tfidf)

        # Transform the influencer profile texts and the user's business description into TF-IDF vectors.
        # This converts text into numerical representations.
        influencer_tfidf_matrix = tfidf_vectorizer.transform(influencers_df['influencer_profile_text'])
        user_tfidf_vector = tfidf_vectorizer.transform([user_business_description])

        print("TF-IDF vectorization complete. Text data converted to numerical vectors.")

        # --- Cosine Similarity Calculation (Next Step's focus, but included here for full function) ---
        print("\nStarting Cosine Similarity Calculation...")
        cosine_similarities = cosine_similarity(user_tfidf_vector, influencer_tfidf_matrix).flatten()
        influencers_df['similarity_score'] = cosine_similarities
        print("Cosine similarity calculation complete. Scores added to DataFrame.")

        # --- Recommendation (Also part of the full function, subsequent steps) ---
        recommended_influencers = influencers_df.sort_values(by='similarity_score', ascending=False)

        print("\nTop Recommended Influencers (based on current processing):")
        print(recommended_influencers[['username', 'similarity_score', 'avg_likes', 'avg_comments']].head(top_n))

        return recommended_influencers.head(top_n)

    except FileNotFoundError:
        print(f"Error: The data file '{data_file_path}' was not found. Please ensure Step 3 was run successfully.")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during the recommendation process: {e}")
        return None