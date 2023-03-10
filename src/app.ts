import express, {Response} from 'express';
import { router } from './routes/api.js';
import dotenv from 'dotenv';

dotenv.config()

const app = express();

app.use(express.json());
app.use(router);


const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
