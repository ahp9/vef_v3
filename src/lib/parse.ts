import { slugify } from "./slugify";
import { courses } from "../routes/courses";

type DepartmentImport = {
    title: string,
    slug: string;
    description: string ;
    csv: string;
}

/**
 * Parse JSON data representing index files.
 * @param input string with JSON data
 * @returns parsed list of files
 */
export function parseJson(input: string): Array<DepartmentImport> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    console.error('error parsing JSON', e);
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const items: Array<DepartmentImport> = [];
  for (const i of parsed) {
    const item = i as Partial<DepartmentImport>;
    if (!item.title || !item.description || !item.csv) {
      console.warn('missing required properties in JSON');
    } else {
      items.push({
        title: item.title,
        slug: slugify(item.title).toLowerCase(),
        description: item.description,
        csv: item.csv,
      });
    }
  }

  return items;
}

function parseLine(line: string): Omit<courses, 'id'> | null {
  const [
    id,
    title ,
    lineUnits,
    lineSemester,
    lineLevel,
    lineUrl,
  ] = line.split(';');

  const formattedUnits = (lineUnits ?? '').replace(/\./g, '').replace(',', '.');
  const parsedUnits = Number.parseFloat(formattedUnits);
  const units =
    (lineUnits ?? '').indexOf('.') < 0 &&
    !Number.isNaN(parsedUnits) &&
    formattedUnits === parsedUnits.toString()
      ? parsedUnits
      : undefined;

  const semester = lineSemester;

  const level =
    typeof lineLevel === 'string' && lineLevel.length ? lineLevel : undefined;

  let url;

  try {
    url = new URL(lineUrl ?? '').href;
  } catch (e) {
    // do nothing if URL is invalid
  }

  if (!id || !title || !semester || !units || !url ) {
    /*
    console.warn(`missing required properties`, {
      id: Boolean(id),
      title: Boolean(title),
      semester: Boolean(semester),
    });
    */
    return null;
  }

  return {
    number: id,
    title,
    units,
    semester,
    level,
    url,
  };
}

/**
 * Parse CSV data for a course.
 * @param {string} data string with CSV data
 * @returns {Array<Course>} parsed list of courses
 */
export function parseCsv(data: string) {
  if (!data) {
    return [];
  }

  const course = [];
  const lines = data.split('\n').slice(1);

  for (const line of lines) {
    const parsed = parseLine(line);

    if (parsed) {
      course.push(parsed);
    } else {
      // console.warn(`error parsing line`, { line });
    }
  }

  return course;
}



