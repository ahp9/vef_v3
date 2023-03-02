import express, { Request, Response, NextFunction} from 'express';
import {  query } from '../lib/db.js';
import { mapOfEventToEvents, mapOfEventToEvent} from '../lib/events.js';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM events');
  const events =mapOfEventToEvents(eventsResult);
  res.json({events});
  next();
}


export async function event(req: Request, res: Response, next: NextFunction){
  const {  slug } = req.params;
  const eventsResult = await query('SELECT * FROM events WHERE id = $1', [slug]);
  
  const event = mapOfEventToEvent(eventsResult);
  if(!event){
    return next();
  }
  
  res.json({event});
  next();
}

async function patchEvent(){

}


async function createdEvent(req: Request, res: Response, next: NextFunction){
  const { title, slug, description} = req.body;

  res.json({title, slug, description});
}


async function deleteEvent(){

}

router.get('/', index);
router.get('/:slug', event);
router.patch('/:slug', patchEvent)
router.post('/', createdEvent);
router.delete('/:slug', deleteEvent);
