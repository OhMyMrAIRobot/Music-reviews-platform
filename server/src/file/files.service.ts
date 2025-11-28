import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  /**
   * Save a file buffer to disk under `public/<folder>[/<subfolder>]`.
   *
   * The method ensures the destination directory exists, generates a
   * unique filename and writes the file buffer to disk. It returns the
   * generated filename (not the full path) which callers can store in the
   * database.
   *
   * @param file Multer file object with `buffer` and original filename
   * @param folder Top-level folder under `public` to store the file
   * @param subfolder Optional nested folder under `folder`
   * @returns Generated filename (string)
   */
  async saveFile(
    file: Express.Multer.File,
    folder: string,
    subfolder?: string,
  ): Promise<string> {
    const basePath = path.join('public', folder);
    const fullPath = subfolder ? path.join(basePath, subfolder) : basePath;

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const filename = `file-${uniqueSuffix}${ext}`;
    const filePath = path.join(fullPath, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return filename;
  }

  /**
   * Delete a file previously saved under `public`.
   *
   * The `filePath` is expected to be a relative path (for example
   * `authors/avatars/filename.jpg`) and the method ignores missing
   * files (no error thrown when file does not exist).
   *
   * @param filePath Relative path under `public` to delete
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join('public', filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }
}
