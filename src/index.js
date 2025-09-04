import express from 'express';
import cors from 'cors';
import { postGitInfor } from './controller/aiServer.controller.js';
import { config } from 'dotenv';

config({ path: '.env' });

const app = express();

app.use(cors());

app.post('/', postGitInfor);
app.listen(process.env.PORT_SERVER, () => {
  console.log(`Server running at http://localhost:${process.env.PORT_SERVER}`);
});
