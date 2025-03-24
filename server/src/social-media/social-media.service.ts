import { Injectable } from '@nestjs/common';
import { SocialMedia } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../exceptions/no-data.exception';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';

@Injectable()
export class SocialMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSocialMediaDto: CreateSocialMediaDto,
  ): Promise<SocialMedia> {
    await this.checkDuplicateSocialMedia(createSocialMediaDto.name);

    return this.prisma.socialMedia.create({
      data: createSocialMediaDto,
    });
  }

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

  async update(
    id: string,
    updateSocialMediaDto: UpdateSocialMediaDto,
  ): Promise<SocialMedia> {
    if (
      !updateSocialMediaDto ||
      Object.keys(updateSocialMediaDto).length === 0
    ) {
      throw new NoDataProvidedException();
    }

    await this.findById(id);
    await this.checkDuplicateSocialMedia(updateSocialMediaDto.name ?? '');

    return this.prisma.socialMedia.update({
      where: { id },
      data: updateSocialMediaDto,
    });
  }

  async checkDuplicateSocialMedia(name: string) {
    console.log(name);
    const existingSocialMedia = await this.prisma.socialMedia.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existingSocialMedia) {
      throw new DuplicateFieldException(
        'Социальная сеть',
        'названием',
        `${existingSocialMedia.name}`,
      );
    }
  }

  async remove(id: string): Promise<SocialMedia> {
    await this.findById(id);

    return this.prisma.socialMedia.delete({
      where: { id },
    });
  }
}
