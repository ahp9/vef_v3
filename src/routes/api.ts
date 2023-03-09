import express, { Request, Response} from 'express';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from './courses.js';
import { createDepartment, deleteDepartment, getDepartment, listDepartments, updateDepartment } from './departments.js';

export const router = express.Router();

export async function index(req: Request, res: Response){
  return res.json([
    {
      href:'/departments',
      methods:['GET', 'POST'],
    },
    {
      href: '/departments/:slug',
      methods: ['GET, PATCH, DELETE'],
    },
    {
      href: '/departments/:slug/courses',
      methods: ['GET', 'POST']
    },
    {
      href: '/departments/:slug/courses/:couseId',
      methods: ['GET', 'PATCH', 'DELETE']
    }
  ])
}

router.get('/', index);

//Vefþjónusta fyrir deildir
router.get('/departments', listDepartments);
router.get('/departments/:slug', getDepartment);
router.post('/departments', createDepartment);
router.patch('/departments/:slug', updateDepartment);
router.delete('/departments/:slug', deleteDepartment);

//Vefþjóunsta fyrir námskeið
router.get('/departments/:slug/courses', listCourses);
router.get('/departments/:slug/courses/:courseID', getCourse);
router.post('/departments/:slug/courses', createCourse);
router.patch('/departments/:slug/courses/:courseID', updateCourse);
router.delete('/departments/:slug/courses/:courseID', deleteCourse);