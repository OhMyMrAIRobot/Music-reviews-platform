import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfile } from '@prisma/client';
import { NoDataProvidedException } from '../exceptions/no-data.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany();
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      throw new EntityNotFoundException('Profile', 'userId', `${userId}`);
    }

    return profile;
  }

  async updateByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    if (!updateProfileDto || Object.keys(updateProfileDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findByUserId(userId);

    return this.prisma.userProfile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
