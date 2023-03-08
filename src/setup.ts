import { readFile } from 'fs/promises';
import { createSchema, dropSchema, end, insertCourse, insertDepartment, query } from './lib/db.js';
import { departments } from './routes/departments.js';
import { join } from "path";
import { parseCsv } from './lib/parse.js';

const Data_dir = "./data/";
const Output_dir = "./dist";


async function setup() {
  const drop = await dropSchema();

  if (drop) {
    console.info('schema dropped');
  } else {
    console.info('schema not dropped, exiting');
    //poolEnd();
    return process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
    //poolEnd()
    return process.exit(-1);
  }

  const dataFile = await readFile(Data_dir, '/index.json');;
  let parsedJson = JSON.parse(dataFile);

  

  for(const i of parsedJson){
    const csvFile = await readFile(join(Data_dir, i.csv), {
      encoding: 'latin1',
    });

    const courses = parseCsv(csvFile);

    const department: Omit<departments, 'id'> = {
      title: i.title,
      slug: i.slug,
      description: i.description,
    }

    const insertDept = await insertDepartment(department);

    if(!insertDept) {
      console.error('unable to insert department', i);
      continue;
    }

    let validInsert = 0;
    let invalidInserts = 0;

    for(const course of courses){
      const id = await insertCourse(course, insertDept.id);
      if(id){
        validInsert++;
      } else {
        invalidInserts++;
      }
    }
    console.info(`Creted department ${i.title} with ${validInsert} courses and ${invalidInserts} invalid courses`,);
  }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});