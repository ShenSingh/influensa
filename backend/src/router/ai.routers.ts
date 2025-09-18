import { Router } from 'express';
import { getAIRecommendations } from '../controller/ai.controller';

const aiRouter = Router();


// aiRouter.use(authenticateToken);

aiRouter.post('/recommend', getAIRecommendations);

export default aiRouter;
