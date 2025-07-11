import { Injectable } from '@nestjs/common';
import { ProfileSocialMedia } from '@prisma/client';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DuplicateFieldException } from '../../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../../exceptions/no-data.exception';
import { SocialMediaService } from '../../social-media/social-media.service';
import { AdminCreateSocialMediaDto } from '../dto/admin-create-social-media.dto';
import { CreateProfileSocialMediaDto } from '../dto/create-profile-social-media.dto';
import { UpdateProfileSocialMediaDto } from '../dto/update-profile-social-media.dto';
import { ProfilesService } from './profiles.service';

@Injectable()
export class ProfileSocialMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
    private readonly socialMediaService: SocialMediaService,
    private readonly usersService: UsersService,
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
    socialId: string,
    userId: string,
    updateDto: UpdateProfileSocialMediaDto,
  ): Promise<ProfileSocialMedia> {
    if (!updateDto || Object.keys(updateDto).length === 0) {
      throw new NoDataProvidedException();
    }

    const profileSocial = await this.getSocial(socialId, userId);

    return this.prisma.profileSocialMedia.update({
      where: {
        profileId_socialId: { profileId: profileSocial.profileId, socialId },
      },
      data: updateDto,
    });
  }

  async delete(socialId: string, userId: string): Promise<ProfileSocialMedia> {
    const profileSocial = await this.getSocial(socialId, userId);

    return this.prisma.profileSocialMedia.delete({
      where: {
        profileId_socialId: { profileId: profileSocial.profileId, socialId },
      },
    });
  }

  async adminCreate(
    req: IAuthenticatedRequest,
    userId: string,
    socialId: string,
    dto: AdminCreateSocialMediaDto,
  ): Promise<ProfileSocialMedia> {
    await this.usersService.checkPermissions(req.user, userId);

    return this.create(userId, { socialId, url: dto.url });
  }

  async adminUpdate(
    req: IAuthenticatedRequest,
    userId: string,
    socialId: string,
    dto: UpdateProfileSocialMediaDto,
  ) {
    await this.usersService.checkPermissions(req.user, userId);

    return this.update(socialId, userId, dto);
  }

  async adminDelete(
    req: IAuthenticatedRequest,
    userId: string,
    socialId: string,
  ) {
    await this.usersService.checkPermissions(req.user, userId);

    return this.delete(socialId, userId);
  }

  private async getSocial(
    socialId: string,
    userId: string,
  ): Promise<ProfileSocialMedia> {
    const profile = await this.profilesService.findByUserId(userId);

    const profileSocial = await this.prisma.profileSocialMedia.findUnique({
      where: {
        profileId_socialId: { profileId: profile.id, socialId },
      },
    });

    if (!profileSocial) {
      throw new EntityNotFoundException(
        `Социальная сеть с id ${socialId} и`,
        'id пользователя',
        `${userId}`,
      );
    }

    return profileSocial;
  }
}
