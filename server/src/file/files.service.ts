import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
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

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join('public', filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }
}
