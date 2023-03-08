import { Request, Response, NextFunction} from 'express';
import {  deletedDepartment, insertDepartment, query } from '../lib/db.js';
import { QueryResult } from "pg";
import { slugify } from '../lib/slugify.js';


export type departments = {
    id: number;
    title: string;
    slug: string | null;
    description: string;
   // courses: Array<courses>;
}

export function departmentMapper(input: unknown| null,): departments | null{
    const potentialEvent = input as Partial<departments|null>;

    if(!potentialEvent || 
        !potentialEvent.id|| 
        !potentialEvent.title || 
        !potentialEvent.slug ||
        !potentialEvent.description){
        return null;
    }

    const departments: departments = {
        id: potentialEvent.id,
        title:potentialEvent.title,
        slug: potentialEvent.slug,
        description: potentialEvent.description,
       // courses: potentialEvent.courses;
    }

    return departments;
}

export function mapOfDepartmentToDepartment(input: QueryResult<any> |null, ): departments | null {
    if(!input){
        return null;
    }

    return departmentMapper(input.rows[0]);
}

export function mapOfDepartmentsToDepartments(input: QueryResult<any>| null) : Array<departments>{
   if(!input){
    return[]
   }

   const mappedEvents = input?.rows.map(departmentMapper);
   return mappedEvents.filter((i): i is departments => Boolean(i));
}

export async function listDepartments(req: Request, res: Response, next: NextFunction) {
    const eventsResult = await query('SELECT * FROM departments');
    const departments = mapOfDepartmentsToDepartments(eventsResult);
    res.json({departments});
    next();
}


export async function getDepartment(req: Request, res: Response, next: NextFunction){
    const {  slug } = req.params;
    const departmentsResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);
    const department = mapOfDepartmentToDepartment(departmentsResult);
    if(!department){
      return next();
    }
    
    res.json({department});
    next();
}

export async function createDepartmentHandler(req: Request, res: Response, next: NextFunction){
    const { title, description} = req.body;
    console.log(title);
    const slug = slugify(title, "");
    console.log(slug);
    const departmentToCreate: Omit<departments, 'id'> = {
        title, 
        slug,
        description,
        //courses: []
    }

    console.log(departmentToCreate);

    const createdDepartment = await insertDepartment(departmentToCreate);

    if(!createdDepartment){
        return next(new Error('unable to create department'));
    }
    return res.json(departmentMapper(createDepartment));
}

 
export const createDepartment = {
   // stringValidator({field: 'title', maxLength: 64}),
   // stringValidator({field: 'description',
   // valueRequired: false,
   // maxLength: 1000,
   // }),
   // departmentDoesNotExistValitador,
   // xssSanitizer('title'),
   // xssSanitizer('description'),
   // validationCheck,
   // genericSanitizer('title'),
   // genericSanitizer('description'),
    createDepartmentHandler,
};


export async function updateDepartment(req: Request, res: Response, next: NextFunction){
    console.log(req.body);
    console.log(req.params);
    return next();
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction){
    const {  slug } = req.params;
    const departmentsResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);
    const department = mapOfDepartmentToDepartment(departmentsResult);
    
    if(!department){
      return next();
    }
    
    deletedDepartment(department?.id);

    return next();
}