import express, { Request, Response, NextFunction} from 'express';


export type courses = {
    id: number;
    title: string;
    slug: string;
    description: string;
}

export async function listCourses(req: Request, res: Response, next: NextFunction){

}

export async function getCourse(req: Request, res: Response, next: NextFunction){

}

export async function createCourse(req: Request, res: Response, next: NextFunction){

}

export async function updateCourse(req: Request, res: Response, next: NextFunction){

}

export async function deleteCourse(req: Request, res: Response, next: NextFunction){

}