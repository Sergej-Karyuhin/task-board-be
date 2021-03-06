import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File } from './files.entity';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileRepository: Repository<File>) {}

  async checkExistFileInDB(filename: string): Promise<boolean> {
    const isExist = await this.fileRepository.findOne({ select: ['fileId'], where: { filename } });
    if (isExist) {
      return true;
    }
    return false;
  }

  async saveFilename(filename: string, fileId: UUIDType, fileSize: number): Promise<string> {
    try {
      await this.fileRepository.create({ filename, fileId, fileSize }).save();
    } catch (e) {
      throw new HttpException('File already exists!', HttpStatus.CONFLICT);
    }
    return 'File uploaded!';
  }

  async findFileId(filename: string): Promise<string> {
    const modelFile = await this.fileRepository.findOne({ select: ['fileId'], where: { filename } });
    if (!modelFile) {
      throw new HttpException('File was not founded!', HttpStatus.NOT_FOUND);
    }
    return modelFile.fileId as string;
  }
}
