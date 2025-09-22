#!/bin/bash

# Script to run FastAPI server only

echo "Starting Influencer Recommendation API..."
echo "=================================="

# Function to run FastAPI server
run_fastapi() {
    echo "Starting FastAPI server on http://localhost:8000"
    cd /Users/gayashanashinshana/Documents/MyWork/WorkingProjects/Ai-model
    uvicorn api:app --reload --host 0.0.0.0 --port 8000
}

# Start FastAPI server
echo "Starting FastAPI server..."
run_fastapi
