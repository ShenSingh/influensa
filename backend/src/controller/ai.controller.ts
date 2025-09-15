import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = 'http://127.0.0.1:8000';

export const getAIRecommendations = async (req: Request, res: Response) => {
  try {
    const { businessDetails } = req.body;

    if (!businessDetails) {
      return res.status(400).json({
        success: false,
        message: 'Business details are required'
      });
    }

    console.log('Sending to AI service:', { businessDetails });

    // Try different request formats that your AI service might expect
    const requestPayloads = [
      // Format 1: businessDetails as you have it
      { businessDetails },
      // Format 2: business_details (snake_case)
      { business_details: businessDetails },
      // Format 3: text field
      { text: businessDetails },
      // Format 4: description field
      { description: businessDetails },
      // Format 5: query field
      { query: businessDetails },
      // Format 6: Just a string
      businessDetails
    ];

    let aiResponse;
    let lastError;

    // Try each format until one works
    for (const payload of requestPayloads) {
      try {
        console.log('Trying payload format:', payload);

        aiResponse = await axios.post(`${AI_SERVICE_URL}/recommend`, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        });

        console.log('AI service response:', aiResponse.data);
        break; // Success, exit the loop

      } catch (error: any) {
        lastError = error;
        if (error.response?.data) {
          console.log(`Format failed:`, JSON.stringify(payload), 'Error:', error.response.data);
        }
        continue; // Try next format
      }
    }

    if (!aiResponse) {
      throw lastError; // If all formats failed, throw the last error
    }

    // Return the AI response
    res.json(aiResponse.data);

  } catch (error: any) {
    console.error('AI service error:', error);

    // Log the response data if available
    if (error.response?.data) {
      console.error('AI service error details:', error.response.data);
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please try again later.'
      });
    }

    if (error.response) {
      // Forward the AI service error details
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.message || 'AI service error',
        details: error.response.data || 'Unknown error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while processing AI recommendations'
    });
  }
};
