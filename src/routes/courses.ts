import express, { Request, Response, NextFunction} from 'express';
import { QueryResult } from 'pg';
import { conditionalUpdate, deletedCourse, insertCourse, query } from '../lib/db.js';
import { departments, getDepartment, getDepartmentBySlug, mapOfDepartmentToDepartment } from './departments.js';


export type courses = {
    number: string;
    title: string;
    units: number;
    semester: string;
    level?: string;
    url?: string;
}


export function courseMapper(input: unknown| null,): courses | null{
    const potentialEvent = input as Partial<courses|null>;
    console.log(potentialEvent);
    if(!potentialEvent || 
        !potentialEvent.title || 
        !potentialEvent.number ||
        !potentialEvent.units ||
        !potentialEvent.semester ||
        !potentialEvent.url){
        return null;
    }

    const course: courses = {
        number: potentialEvent.number,
        title:potentialEvent.title,
        units: potentialEvent.units,
        semester: potentialEvent.semester,
        level: potentialEvent.level,
        url: potentialEvent.url,
    }

    return course;
}

export function mapOfCourseToCourse(input: QueryResult<any> |null, ): courses | null {
    if(!input){
        return null;
    }

    return courseMapper(input.rows[0]);
}

export function mapOfCoursesToCourses(input: QueryResult<any>| null) : Array<courses>{
   if(!input){
    return[]
   }

   const mappedEvents = input?.rows.map(courseMapper);
   return mappedEvents.filter((i): i is courses => Boolean(i));
}

async function findCourseByCourseId(courseId: string){
    const courseResult = await query('SELECT * FROM courses WHERE number = $1', [courseId]);
    const course = mapOfCourseToCourse(courseResult);

    return course;
}

async function findCourseByDepartmentId(department: departments){
    const coursesResult = await query('SELECT * FROM courses WHERE departments = $1', [department?.id] );
    const courses = mapOfCoursesToCourses(coursesResult);
    return courses;
}


export async function listCourses(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    const department = await getDepartmentBySlug(slug);

    if(!department){
        return next();
    }

    const courses = await findCourseByDepartmentId(department);
    return res.json({courses});
}

export async function getCourse(req: Request, res: Response, next: NextFunction){
    let {  slug , courseID } = req.params;    
    const course = await findCourseByCourseId(courseID);

    if(!course){
      return next();
    }
    
    return res.json({course});
}

export async function createCourse(req: Request, res: Response, next: NextFunction){
    const {slug} = req.params;
    const { 
        number,
        title,
        units,
        semester,
        level,
        url,
    } = req.body;

    const department = await getDepartmentBySlug(slug);

    if(!department){
        return next();
    }

    const departmentID = department.id;

    const courseToCreate: Omit<courses, 'departments'>  = {
        number,
        title,
        units,
        semester,
        level,
        url
    }

    const createdCourse = await insertCourse(courseToCreate, departmentID);

    

    if(!createdCourse){
        return next(new Error('unable to create courses'));
    }
    return res.json(courseMapper(createdCourse));
}

export const createCourseHandler= {
   // stringValidator({field: 'number', maxLength: 6}),
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
    //createDepartmentHandler,
};

export async function updateCourse(req: Request, res: Response, next: NextFunction){
    const {slug, courseID} = req.params;
    const course = await findCourseByCourseId(courseID);
    const department = await getDepartmentBySlug(slug);

    if(!course || !department){
        return next();
    }
    const { 
        number,
        title,
        units,
        semester,
        level,
        url,
    } = req.body;

    const fields = [
        typeof number === 'string' && number ? 'number' : null,
        typeof title === 'string' && title ? 'title' : null,
        typeof units === 'number' && units ? 'units' : null,
    ];

    const values = [
        typeof number === 'string' && number ? number : null,
        typeof title === 'string' && title ? title : null,
        typeof units === 'number' && units ? units : null,
    ];

    console.log(values);
    const update =  await conditionalUpdate(
        'courses',
        courseID,
        fields,
        values
    );

    console.log(update);

    if(!update){
        return next(new Error('unable to update department'));
    }
    return res.json(update.rows[0]);

    /*

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
    */
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction){
    const {  slug, courseID } = req.params;
    const course =  await findCourseByCourseId(courseID);
    
    if(!course){
      return next();
    }
    
    deletedCourse(course?.number);

    return res.status(204).json({error: ''});
}