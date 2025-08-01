import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/utils/format-full-date';

class ReleaseMediaStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

class ReleaseMediaType {
  @Expose()
  id: string;

  @Expose()
  type: string;
}

class ReleaseMediaUser {
  @Expose()
  id: string;

  @Expose()
  nickname: string;
}

class ReleaseMediaRelease {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  img: string;
}

export class ReleaseMediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  @Type(() => ReleaseMediaStatus)
  releaseMediaStatus: ReleaseMediaStatus;

  @Expose()
  @Type(() => ReleaseMediaType)
  releaseMediaType: ReleaseMediaType;

  @Expose()
  @Type(() => ReleaseMediaUser)
  user: ReleaseMediaUser | null;

  @Expose()
  @Type(() => ReleaseMediaRelease)
  release: ReleaseMediaRelease;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
  createdAt: string;

  @Exclude()
  releaseId: string;

  @Exclude()
  userId: string;

  @Exclude()
  releaseMediaTypeId: string;

  @Exclude()
  releaseMediaStatusId: string;
}
