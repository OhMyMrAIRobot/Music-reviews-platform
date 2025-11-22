import { Injectable } from '@nestjs/common';
import { SocialMedia } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';

@Injectable()
export class SocialMediaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all available social media records.
   *
   * This method performs a simple `findMany` on the `socialMedia` table
   * and is intended for populating client lists.
   *
   * @returns Promise<SocialMedia[]> - array of social media records.
   */
  async findAll(): Promise<SocialMedia[]> {
    return this.prisma.socialMedia.findMany();
  }

  /**
   * Fetches a social media record by its id.
   *
   * Throws `EntityNotFoundException` when the id does not match an
   * existing record.
   *
   * @param id - entity id of the social media record
   * @returns Promise<SocialMedia> - the found social media record
   * @throws EntityNotFoundException when not found
   */
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
