import { readdir, stat } from "fs/promises";
import { join } from "path";

/**
 * Check if a directory exists.
 * @param {string} dir Directory to check
 * @returns 'true' if dir exists, 'false' otherwise
 */
export async function direxists(dir: string) {
  try {
    const info = await stat(dir);
    return info.isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * Read only files from a directory and returns as an array.
 *
 * @param {string} dir Directory to read files from
 * @returns {string[]} Array of files in dir with full path
 */
export async function readFilesFromDir(dir: string) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch (e) {
    return [];
  }

  const mapped = files.map(async (file) => {
    const path = join(dir, file);
    const info = await stat(path);

    if (info.isDirectory()) {
      return null;
    }

    return path;
  });

  const resolved = await Promise.all(mapped);

  return resolved.filter(Boolean);
}
