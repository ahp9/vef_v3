import express, { Request, Response, NextFunction } from 'express';
import { sayHello } from '../lib/hello.js';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const events = await listEvents();
  res.json({ events});
  next();
}

export async function bye() {
  console.log('done');
}

export async function error() {
  throw new Error('error');
}

router.get('/', index);


