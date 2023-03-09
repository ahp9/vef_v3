import { readFile } from 'fs/promises';
import { createSchema, dropSchema, end, query } from './lib/db.js';

async function create() {
  const drop = await dropSchema();

  if (drop) {
    console.info('schema dropped');
  } else {
    console.info('schema not dropped, exiting');
    process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
  }

  const data = await readFile('./sql/insert.sql');
  const insert = await query(data.toString('utf-8'));

  if (insert) {
    console.info('data inserted');
  } else {
    console.info('data not inserted');
  }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});

/*
const Data_dir = "./data/";


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

  const dataFile = await readFile(join(Data_dir, 'index.json'));
  let indexFile= parseJson(dataFile.toString('utf-8'));

  

  for(const i of indexFile){
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

*/