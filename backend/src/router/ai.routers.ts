import { Router } from 'express';
import { getAIRecommendations } from '../controller/ai.controller';

const aiRouter = Router();

// Apply authentication middleware
// aiRouter.use(authenticateToken);

// AI recommendation route
aiRouter.post('/recommend', getAIRecommendations);

export default aiRouter;
