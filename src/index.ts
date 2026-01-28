import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { aiReviewWorkFlow } from './controller/aiServer.controller.js';
import { config } from 'dotenv';
import { validateReviewerController } from './controller/auth.controller.js';

config({ path: '.env' });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/review', aiReviewWorkFlow);
app.post('/auth', validateReviewerController);
app.listen(process.env.PORT_SERVER, () => {
  console.log(`Server running at http://localhost:${process.env.PORT_SERVER}`);
});
// console.log
