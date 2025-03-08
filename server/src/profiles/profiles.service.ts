import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma.service';
import { UserProfile } from '@prisma/client';

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
      throw new NotFoundException(`Profile with user id: ${userId} not found!`);
    }

    return profile;
  }

  async updateByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException(`Profile with user id: ${userId} not found!`);
    }

    return this.prisma.userProfile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
