import { Request, Response } from 'express';
import axios from 'axios';
import {Influencer, InfluencerModel} from "../models/Influencer";


const AI_SERVICE_URL = 'http://127.0.0.1:8000';

interface RequestBody {
  business_description: string;
}
interface AiResponseBody {
  username: string;
  similarity_score: any;
  avg_likes: any;
  avg_comments: any;
}

interface ResponseBody {
  username: string;
  similarity_score: number;
  avg_likes: number;
  avg_comments: number;
  influencer: Influencer;
  hasProfile: boolean;
}

export const getAIRecommendations = async (req: Request, res: Response) => {
  try {
    const { businessDetails } = req.body;

    if (!businessDetails || typeof businessDetails !== 'string' || businessDetails.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Valid business details are required'
      });
    }
    console.log("business Details :" + businessDetails);

    const requestBody: RequestBody = {
      business_description: businessDetails.trim()
    };

    // Call the AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/recommend`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (aiResponse.status === 200) {
      const arr: AiResponseBody[] = aiResponse.data.recommendations;
      const responseData: ResponseBody[] = [];

      for (const i of arr) {

        if (i.similarity_score !== 0){
          const influ: Influencer = await findInfluencerByUsername(i.username);

          if (influ) {
            const responseBody: ResponseBody = {
              username: influ.socialName,
              similarity_score: parseFloat(i.similarity_score),
              avg_likes: parseInt(i.avg_likes),
              avg_comments: parseInt(i.avg_comments),
              influencer: influ,
              hasProfile: true
            };
            responseData.push(responseBody);
          }
        }
      }

      return res.status(200).json({
        success: true,
        recommendations: responseData
      });
    } else {
      return res.status(aiResponse.status).json({
        success: false,
        message: 'Failed to get recommendations from AI service',
        details: aiResponse.data || 'Unknown error'
      });
    }

  } catch (error: any) {
    console.error('AI service error:', error);

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
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.message || 'AI service error',
        details: error.response.data || 'Unknown error'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing AI recommendations'
    });
  }
};


async function findInfluencerByUsername(username: string): Promise<any> {

  const influencer = await InfluencerModel.findOne({socialName: username});

  if (influencer) {
    console.log(`Influencer found: ${username}`);
    return influencer;
  } else {
    console.log(`Influencer not found: ${username}`);
  }
}
