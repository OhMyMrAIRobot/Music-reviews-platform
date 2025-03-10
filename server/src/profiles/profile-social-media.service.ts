import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileSocialMedia } from '@prisma/client';
import { CreateProfileSocialMediaDto } from './dto/create-profile-social-media.dto';
import { ProfilesService } from './profiles.service';
import { SocialMediaService } from '../social-media/social-media.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { UpdateProfileSocialMediaDto } from './dto/update-profile-social-media.dto';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../exceptions/no-data.exception';
import { InsufficientPermissionsException } from '../exceptions/insufficient-permissions.exception';

@Injectable()
export class ProfileSocialMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
    private readonly socialMediaService: SocialMediaService,
  ) {}

  async create(
    userId: string,
    createDto: CreateProfileSocialMediaDto,
  ): Promise<ProfileSocialMedia> {
    const profile = await this.profilesService.findByUserId(userId);

    const { socialId } = createDto;
    const profileId = profile.id;

    await this.socialMediaService.findById(socialId);

    const existingProfileSocial =
      await this.prisma.profileSocialMedia.findUnique({
        where: {
          profileId_socialId: { profileId, socialId },
        },
      });

    if (existingProfileSocial) {
      throw new DuplicateFieldException(
        'Profile social media',
        'profileId - socialId',
        `${profileId} - ${socialId}`,
      );
    }

    return this.prisma.profileSocialMedia.create({
      data: {
        ...createDto,
        profileId,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<ProfileSocialMedia[]> {
    const profile = await this.profilesService.findByUserId(userId);

    return this.prisma.profileSocialMedia.findMany({
      where: {
        profileId: profile.id,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateProfileSocialMediaDto,
  ): Promise<ProfileSocialMedia> {
    if (!updateDto || Object.keys(updateDto).length === 0) {
      throw new NoDataProvidedException();
    }

    const profileSocial = await this.getById(id);
    await this.checkBelongsToUser(profileSocial, userId);

    return this.prisma.profileSocialMedia.update({
      where: { id },
      data: updateDto,
    });
  }

  async delete(id: string, userId: string): Promise<ProfileSocialMedia> {
    const profileSocial = await this.getById(id);
    await this.checkBelongsToUser(profileSocial, userId);

    return this.prisma.profileSocialMedia.delete({
      where: { id },
    });
  }

  private async getById(id: string): Promise<ProfileSocialMedia> {
    const profileSocial = await this.prisma.profileSocialMedia.findUnique({
      where: { id },
    });

    if (!profileSocial) {
      throw new EntityNotFoundException('Profile social media', 'id', `${id}`);
    }

    return profileSocial;
  }

  private async checkBelongsToUser(
    profileSocial: ProfileSocialMedia,
    userId: string,
  ) {
    const profile = await this.profilesService.findByUserId(userId);

    if (profileSocial.profileId !== profile.id) {
      throw new InsufficientPermissionsException();
    }
  }
}
