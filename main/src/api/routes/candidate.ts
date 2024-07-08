import { Router } from 'express';
import { isAuth } from '../middleware';
import { createCandidate, getUserCandidate } from '../controller/candidateController';

const candidateRouter = Router();

candidateRouter.use(isAuth);

candidateRouter.get('/', getUserCandidate);
candidateRouter.post('/', createCandidate);

export default candidateRouter;
