import 'dotenv-safe/config';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { PORT } from './Constants';
import ApiRouter from './api';
import { connectAndMigrate } from './db';
import { sessionManager } from './api/middleware';

async function main() {
  await connectAndMigrate();
  const app = express();
  app.use(helmet(), cors(), express.json(), sessionManager);
  app.use('/api', ApiRouter);
  app.listen(PORT, () => console.log('Server started at port', PORT));
}
main();
