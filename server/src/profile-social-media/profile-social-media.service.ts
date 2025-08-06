import { ConflictException, Injectable } from '@nestjs/common';
import { ProfileSocialMedia } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { UpdateProfileSocialMediaRequestDto } from 'src/profile-social-media/dto/request/update-profile-social-media.request.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { SocialMediaService } from 'src/social-media/social-media.service';
import { UsersService } from 'src/users/users.service';
import { CreateProfileSocialMediaRequestDto } from './dto/request/create-profile-social-media.request.dto';

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
    socialId: string,
    createDto: CreateProfileSocialMediaRequestDto,
  ): Promise<ProfileSocialMedia> {
    const profile = await this.profilesService.findByUserId(userId);

    const profileId = profile.id;

    await this.socialMediaService.findById(socialId);

    const existingProfileSocial =
      await this.prisma.profileSocialMedia.findUnique({
        where: {
          profileId_socialId: { profileId, socialId },
        },
      });

    if (existingProfileSocial) {
      throw new ConflictException(
        'Даная социальная сеть уже указана для этого профиля!',
      );
    }

    return this.prisma.profileSocialMedia.create({
      data: {
        socialId,
        profileId,
        ...createDto,
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
    updateDto: UpdateProfileSocialMediaRequestDto,
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
    dto: CreateProfileSocialMediaRequestDto,
  ): Promise<ProfileSocialMedia> {
    await this.usersService.checkPermissions(req.user, userId);

    return this.create(userId, socialId, dto);
  }

  async adminUpdate(
    req: IAuthenticatedRequest,
    userId: string,
    socialId: string,
    dto: UpdateProfileSocialMediaRequestDto,
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
