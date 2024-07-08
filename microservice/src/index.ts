import 'dotenv-safe/config';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { connect } from './db';
import publicRouter from './routes/publicRoute';

async function main() {
  await connect();
  const app = express();

  app.use(helmet(), cors(), express.urlencoded(), express.json());
  app.use('/api/public', publicRouter);

  const PORT = process.env.PORT && !Number.isNaN(process.env.PORT) ? parseInt(process.env.PORT, 10) : 3030;
  app.listen(PORT, () => console.log('Microservice running at port', PORT));
}

main();
