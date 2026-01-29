import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { aiReviewWorkFlow } from './infrastructure/restful/controller/aiServer.controller.js';
import { config } from 'dotenv';
import { validateReviewerController } from './infrastructure/restful/controller/auth.controller.js';
import { verifyToken } from './infrastructure/restful/middleware/verifyAccessToken.js';

config({ path: '.env' });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/review', verifyToken, aiReviewWorkFlow);
app.post('/auth', verifyToken, validateReviewerController);
app.listen(process.env.PORT_SERVER, () => {
  console.log(`Server running at http://localhost:${process.env.PORT_SERVER}`);
});
// console.log
