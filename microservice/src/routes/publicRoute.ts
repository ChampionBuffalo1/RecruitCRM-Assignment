import { Router } from 'express';
import { verifyApiKey } from '../apiKeyAuth';
import { getCandidate, getUserInfo } from '../controller/publicController';

const publicRouter = Router();

publicRouter.use(verifyApiKey);

publicRouter.post('/profile', getUserInfo);
publicRouter.get('/candidate', getCandidate);

export default publicRouter;
