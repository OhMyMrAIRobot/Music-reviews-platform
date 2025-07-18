import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatDateCreatedAt } from '../utils/format-date-created-at';

export class UserFullInfo {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ value }) => formatDateCreatedAt(value as Date))
  createdAt: string;

  @Expose()
  @Type(() => Object)
  role: Record<string, any>;

  @Expose()
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;

  @Exclude()
  password: string;

  @Exclude()
  roleId: string;
}

class UserProfileDto {
  @Exclude()
  id: string;

  @Expose()
  avatar: string;

  @Expose()
  coverImage: string;

  @Expose()
  bio?: string;

  @Exclude()
  points: number;

  @Exclude()
  userId: string;

  @Expose()
  @Transform(({ obj }: { obj: ProfileWithSocialMedia }) => {
    return (
      obj.socialMedia?.map((item) => ({
        id: item.social.id,
        name: item.social.name,
        url: item.url,
      })) || []
    );
  })
  socialMedia: SocialNetworkDto[];
}

class SocialNetworkDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;
}

type SocialMediaItem = {
  social: {
    id: string;
    name: string;
  };
  url: string;
};

type ProfileWithSocialMedia = {
  socialMedia?: SocialMediaItem[];
};
