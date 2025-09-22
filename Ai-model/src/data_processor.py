# src/data_processor.py

import pandas as pd
import re
from datetime import datetime, timedelta
import random


def clean_text(text):
    """
    Cleans the input text by removing special characters, URLs, emojis, and converting to lowercase.
    This function is designed to handle English-like text primarily.
    """
    if not isinstance(text, str):
        return ""  # Return empty string for non-string types

    # Remove URLs (http, https, www)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    # Remove emojis (a basic regex, might need to be expanded for all Unicode emojis)
    # This regex specifically targets common emoji blocks.
    text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]+', '', text)

    # Remove special characters, numbers, and punctuation, keep only letters and spaces
    # This might need adjustment if you want to keep specific punctuation like periods or commas.
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    # Convert to lowercase
    text = text.lower()

    # Remove extra spaces and strip leading/trailing spaces
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def preprocess_and_combine_data(existing_data_path,
                                output_file_path='data/combined_preprocessed_influencer_data.csv'):

    all_data_df = pd.DataFrame()

    # Load existing data (dataset - Sheet1.csv)
    try:
        existing_df = pd.read_csv(existing_data_path)
        print(f"Loaded existing data from {existing_data_path}. Initial shape: {existing_df.shape}")

        # Standardize column names to lowercase and replace spaces with underscores
        existing_df.columns = [col.lower().replace(' ', '_') for col in existing_df.columns]

        # Ensure 'post_date' is in a consistent format like 'DD/MM/YYYY'
        # Coerce errors will turn unparseable dates into NaT (Not a Time), which fillna handles.
        existing_df['post_date'] = pd.to_datetime(existing_df['post_date'], errors='coerce').dt.strftime(
            '%d/%m/%Y').fillna('')

        all_data_df = pd.concat([all_data_df, existing_df], ignore_index=True)
    except FileNotFoundError:
        print(f"Warning: Existing data file '{existing_data_path}' not found. Continuing without it.")
    except Exception as e:
        print(f"An error occurred loading existing data: {e}. Continuing without it.")

    if all_data_df.empty:
        print("Error: No data loaded or generated. Returning empty DataFrame.")
        return all_data_df

    print(f"Combined data. Total shape: {all_data_df.shape}")

    # --- Data Preprocessing ---
    print("\nStarting data preprocessing...")

    # Ensure required columns exist, fill with empty string if missing
    required_cols = ['platform', 'username', 'post_date', 'caption_text', 'post_type', 'likes', 'comments', 'hashtags']
    for col in required_cols:
        if col not in all_data_df.columns:
            all_data_df[col] = ''  # Add missing column with empty strings
            print(f"Added missing column: '{col}'")

    # Handle missing values for text columns: fill NaN with empty strings
    for col in ['caption_text', 'hashtags']:
        all_data_df[col] = all_data_df[col].astype(str).fillna("")

    # Convert likes and comments to numeric, coercing errors to NaN, then fill NaN with 0
    # and convert to integer type.
    for col in ['likes', 'comments']:
        all_data_df[col] = pd.to_numeric(all_data_df[col], errors='coerce').fillna(0).astype(int)

    # Apply text cleaning to relevant columns
    all_data_df['cleaned_caption'] = all_data_df['caption_text'].apply(clean_text)
    all_data_df['cleaned_hashtags'] = all_data_df['hashtags'].apply(clean_text)

    # Drop duplicate rows based on a combination of identifying columns
    # This prevents duplicate posts if combining data from various sources or multiple runs.
    all_data_df.drop_duplicates(subset=['username', 'post_date', 'caption_text'], inplace=True)

    print("Data preprocessing complete. Final DataFrame head:")
    print(all_data_df.head())
    print(f"Final data shape after cleaning: {all_data_df.shape}")

    # Save the combined and preprocessed data to the specified output path
    all_data_df.to_csv(output_file_path, index=False)
    print(f"\nCombined and preprocessed data saved to '{output_file_path}'")
    print("Columns in the final CSV:", all_data_df.columns.tolist())

    return all_data_df