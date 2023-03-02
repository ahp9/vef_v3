import { QueryResult } from "pg";


export type departments = {
    id: number;
    title: string;
    description: string;
}

export function departmentMapper(input: unknown| null,): departments | null{
    const potentialEvent = input as Partial<departments|null>;
    
    if(!potentialEvent || 
        !potentialEvent.id|| 
        !potentialEvent.title || 
        !potentialEvent.description){
        return null;
    }

    const departments: departments = {
        id: potentialEvent.id,
        title:potentialEvent.title,
        description: potentialEvent.description,
    }

    return departments;
}

export function mapOfDepartmentToDepartment(input: QueryResult<any> |null, ): departments | null {
    if(!input){
        return null;
    }

    return departmentMapper(!input.rows);
}

export function mapOfDepartmentsToDepartments(input: QueryResult<any>| null) : Array<departments>{
   if(!input){
    return[]
   }

   const mappedEvents = input?.rows.map(departmentMapper);
   return mappedEvents.filter((i): i is departments => Boolean(i));
}
