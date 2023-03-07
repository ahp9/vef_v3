import express, { Request, Response, NextFunction} from 'express';
import { QueryResult } from 'pg';
import { query } from '../lib/db.js';
import { getDepartment, mapOfDepartmentToDepartment } from './departments.js';


export type courses = {
    number: string;
    title: string;
    units: number;
    semester: string;
    level: string;
    url: string;
    departments: number;

}


export function courseMapper(input: unknown| null,): courses | null{
    const potentialEvent = input as Partial<courses|null>;

    if(!potentialEvent || 
        !potentialEvent.title || 
        !potentialEvent.number ||
        !potentialEvent.units ||
        !potentialEvent.semester ||
        !potentialEvent.level ||
        !potentialEvent.url||
        !potentialEvent.departments){
        return null;
    }

    const course: courses = {
        number: potentialEvent.number,
        title:potentialEvent.title,
        units: potentialEvent.units,
        semester: potentialEvent.semester,
        level: potentialEvent.level,
        url: potentialEvent.url,
        departments: potentialEvent.departments,
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

export async function listCourses(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;


    const departmentsResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);

    const department = mapOfDepartmentToDepartment(departmentsResult);
    if(!department){
        return next();
    }

    const coursesResult = await query('SELECT * FROM courses WHERE departments = $1', [department?.id] );
   
    const courses = mapOfCoursesToCourses(coursesResult);
    res.json({courses});
    next();
}

export async function getCourse(req: Request, res: Response, next: NextFunction){
    let {  slug , courseID } = req.params;
    console.log(courseID);
    
    const courseResult = await query('SELECT * FROM courses WHERE number = $1', [courseID]);
    const course = mapOfCourseToCourse(courseResult);
    if(!course){
      return next();
    }
    
    res.json({course});
    next();
}

export async function createCourse(req: Request, res: Response, next: NextFunction){

}

export async function updateCourse(req: Request, res: Response, next: NextFunction){

}

export async function deleteCourse(req: Request, res: Response, next: NextFunction){

}