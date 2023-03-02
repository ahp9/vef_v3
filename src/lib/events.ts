import { QueryResult } from "pg";


export type Event = {
    id: number;
    name: string;
    slug: string;
    location?: string;
    url?: string;
    description?: string;
    created: Date;
    updated: Date;
}

export function eventMapper(input: unknown| null,): Event | null{
    const potentialEvent = input as Partial<Event|null>;
    
    if(!potentialEvent || 
        !potentialEvent.id || 
        !potentialEvent.name || 
        !potentialEvent.slug ||
        !potentialEvent.created ||
        !potentialEvent.updated){
        return null;
    }

    const event: Event = {
        id: potentialEvent.id,
        name:potentialEvent.name,
        slug: potentialEvent.slug,
        created: new Date(potentialEvent.created),
        updated: new Date(potentialEvent.updated),
    }

    return event;
}

export function mapOfEventToEvent(input: QueryResult<any> |null, ): Event | null {
    if(!input){
        return null;
    }

    return eventMapper(!input.rows);


}

export function mapOfEventToEvents(input: QueryResult<any>| null) : Array<Event>{
   if(!input){
    return[]
   }

   const mappedEvents = input?.rows.map(eventMapper);
   return mappedEvents.filter((i): i is Event => Boolean(i));
}