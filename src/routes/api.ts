import express, { Request, Response, NextFunction} from 'express';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from './courses.js';
import { createDepartment, createDepartmentHandler, deleteDepartment, getDepartment, listDepartments, updateDepartment } from './departments.js';

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


router.get('/departments', listDepartments);
router.get('/departments/:slug', getDepartment);
router.post('/departments', createDepartment);
router.patch('/departments/:slug', updateDepartment);
router.delete('/departments/:slug', deleteDepartment);



router.get('/departments/:slug/courses', listCourses);
router.get('/departments/:slug/courses/:courseID', getCourse);
router.post('/departments/:slug/courses', createCourse);
router.patch('/departments/:slug/courses/:courseID', updateCourse);
router.delete('/departments/:slug/courses/:courseID', deleteCourse);




/*
export async function createdEvent(req: Request, res: Response, next: NextFunction) {
  // Validate the request body
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Insert the new department into the database
  const result = await query('INSERT INTO departments (title, description) VALUES ($1, $2) RETURNING id', [title, description]);
  if (!result || !result.rows || result.rows.length !== 1) {
    res.status(500).json({ error: 'Failed to create department' });
    return;
  }

  // Return the new department
  const newDepartmentId = result.rows[0].id;
  const newDepartment = await getDepartmentById(newDepartmentId);
  res.status(201).json({ department: newDepartment });
}

async function getDepartmentById(id: number): Promise<departments | null> {
  const result = await query('SELECT * FROM departments WHERE id = $1', [id]);
  if (!result || !result.rows || result.rows.length !== 1) {
    return null;
  }
  return mapOfEventToEvent(result);
}

export async function patchEvent(req: Request, res: Response, next: NextFunction) {
  // Validate the request body
  const { title, description } = req.body;
  if (!title && !description) {
    res.status(400).json({ error: 'At least one field is required' });
    return;
  }

  // Update the department in the database
  const { slug } = req.params;
  const result = await query('UPDATE departments SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE slug = $3 RETURNING *', [title, description, slug]);
  if (!result || !result.rows || result.rows.length !== 1) {
    res.status(500).json({ error: 'Failed to update department' });
    return;
  }

  // Return the updated department
  const updatedDepartment = mapOfEventToEvent(result);
  res.json({ department: updatedDepartment });
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  // Delete the department from the database
  const { slug } = req.params;
  const result = await query('DELETE FROM departments WHERE slug = $1 RETURNING *', [slug]);
  if (!result || !result.rows || result.rows.length !== 1) {
    res.status(500).json({ error: 'Failed to delete department' });
    return;
  }

  // Return the deleted department
  const deletedDepartment = mapOfEventToEvent(result);
  res.json({ department: deletedDepartment });
}
*/
