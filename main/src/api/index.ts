import { Router } from 'express';
import { isAuth } from './middleware';
import candidateRouter from './routes/candidate';
import { createApiKey } from './controller/protectedController';
import { loginController, registerController } from './controller/userController';

const ApiRouter = Router();

ApiRouter.post('/register', registerController);
ApiRouter.post('/login', loginController);

ApiRouter.post('/protected', isAuth, createApiKey);
ApiRouter.use('/candidate', candidateRouter);

export default ApiRouter;
