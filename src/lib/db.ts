import pg from 'pg';
import { readFile } from 'fs/promises';
import { departmentMapper, departments } from '../routes/departments.js';


const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';


export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

const { DATABASE_URL: connectionString} = process.env;
// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél


const pool = new pg.Pool({ connectionString });

pool.on('error', (err: Error) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

type QueryInput = string | number | null

export async function query(q: string, values: Array<QueryInput> = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }
  console.log(q);
  console.log(values);
  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    
    return null;
  } finally {
    client.release();
  }
}


export async function insertDepartment(department: Omit<departments, 'id'>)
: Promise<departments | null> {
  const {title, slug, description} = department;
  console.log([title, slug, description]);
  const result = await query(
    'INSERT INTO departments(title, slug, description) VALUES ($1, $2, $3) RETURNING id, title, slug, description, created, updated',
    [title, slug, description]);

  console.log(result); 
  const mapped = departmentMapper(result?.rows[0]);
  return mapped;
}

export async function end() {
  await pool.end();
}
