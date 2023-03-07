import express, { Request, Response, NextFunction} from 'express';
import { router } from './routes/api.js';
import dotenv from 'dotenv';

dotenv.config()

const app = express();

//app.use(express.json);
app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

function notFoundHandler(err: Error, req: Request, res: Response, next: NextFunction){
  res.status(404).json({error: 'Not found'});
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
  console.error(err);

  /*
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err){
    return res.status(400).json({error: 'Invalid json'})
  }
  */
}

app.use(notFoundHandler);
app.use(errorHandler);