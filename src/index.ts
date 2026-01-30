import './infrastructure/factory/globalInject.factory';
// BOOTSTRAP GLOBAL SERVICE, DONT DELETE THIS LINE
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { aiReviewWorkFlow } from './infrastructure/restful/controller/aiServer.controller.js';
import { config } from 'dotenv';
import { validateReviewerController } from './infrastructure/restful/controller/auth.controller.js';
import { verifyToken } from './infrastructure/restful/middleware/verifyAccessToken.js';
import { globalProjectController } from './infrastructure/factory/globalInject.factory';

config({ path: '.env' });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/review', aiReviewWorkFlow);
app.post('/auth', verifyToken, validateReviewerController);
app.get('/project', verifyToken, globalProjectController.get);
app.listen(process.env.PORT_SERVER, () => {
  console.log(`Server running at http://localhost:${process.env.PORT_SERVER}`);
});
// console.log
