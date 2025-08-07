import { Injectable } from '@nestjs/common';
import { SocialMedia } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Injectable()
export class SocialMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SocialMedia[]> {
    return this.prisma.socialMedia.findMany();
  }

  async findById(id: string): Promise<SocialMedia> {
    const socialMedia = await this.prisma.socialMedia.findUnique({
      where: { id },
    });

    if (!socialMedia) {
      throw new EntityNotFoundException('Социльная сеть', 'id', `${id}`);
    }
    return socialMedia;
  }
}
