import { Request, Response, NextFunction} from 'express';
import {  conditionalUpdate, deletedDepartment, insertDepartment, query } from '../lib/db.js';
import { QueryResult } from "pg";
import { slugify } from '../lib/slugify.js';
//import { stringValidator } from '../lib/validation.js';

export type departments = {
    id: number;
    title: string;
    slug: string;
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

export async function getDepartmentBySlug(slug: string){
    const departmentsResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);
    const department = mapOfDepartmentToDepartment(departmentsResult);
    return department;
}


export async function getDepartment(req: Request, res: Response, next: NextFunction){
    const {  slug } = req.params;
    const department = await getDepartmentBySlug(slug);
    if(!department){
      return res.status(404).json({error: 'Not found'});
    }
    
    res.json({department});
    next();
}

export async function createDepartmentHandler(req: Request, res: Response, next: NextFunction){
    const { title, description} = req.body;
    const slug = slugify(title);
    const departmentToCreate: Omit<departments, 'id'> = {
        title, 
        slug,
        description,
        //courses: []
    }

    const createdDepartment = await insertDepartment(departmentToCreate);

    if(!createdDepartment){
        return next(new Error('unable to create department'));
    }
    return res.json(departmentMapper(createdDepartment));
}


export const createDepartment = [
    /*
    stringValidator({
        field: 'title', maxLength: 64,
        optional: false
    }),
    stringValidator({field: 'description',
    valueRequired: false,
    maxLength: 1000,
    optional: false
    }),
    */
   // departmentDoesNotExistValitador,
   // xssSanitizer('title'),
   // xssSanitizer('description'),
   // validationCheck,
   // genericSanitizer('title'),
   // genericSanitizer('description'),
    createDepartmentHandler,
];



export async function updateDepartment(req: Request, res: Response, next: NextFunction){
    const { slug } = req.params;
    const department = await getDepartmentBySlug(slug);

    if(!department){
        return next();
    }

    const {title, description} = req.body;

    const fields = [
        typeof title === 'string' && title ? 'title' : null,
        typeof title === 'string' && title ? 'slug' : null,
        typeof description === 'string' && description ? 'description' : null,
    ];

    const values = [
        typeof title === 'string' && title ? title : null,
        typeof title === 'string' && title ? slugify(title) : null,
        typeof description === 'string' && description ? description : null,
    ];

    const update =  await conditionalUpdate(
        'departments',
        department.id,
        fields,
        values
    );

    if(!update){
        return next(new Error('unable to update department'));
    }

    return res.json(update.rows[0]);
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction){
    const {  slug } = req.params;
    const department = await getDepartmentBySlug(slug);
    
    if(!department){
      return next();
    }

    deletedDepartment(department?.id);
    return res.status(204).json({error: ''});
}