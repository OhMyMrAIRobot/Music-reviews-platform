import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatPublishDate } from 'src/utils/format-publish-date';

class AuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  constructor(partial: Partial<AuthorDto>) {
    Object.assign(this, partial);
  }
}

class ReleaseTypeDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  constructor(partial: Partial<ReleaseTypeDto>) {
    Object.assign(this, partial);
  }
}

type ReleaseWithRelations = Prisma.ReleaseGetPayload<{
  include: {
    releaseType: true;
    releaseArtist: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    releaseProducer: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    releaseDesigner: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export class AdminReleaseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => formatPublishDate(value as Date))
  publishDate: string;

  @Expose()
  img: string;

  @Exclude()
  releaseTypeId: string;

  @Expose()
  @Type(() => ReleaseTypeDto)
  @Transform(
    ({ obj }: { obj: ReleaseWithRelations }) =>
      new ReleaseTypeDto(obj.releaseType),
  )
  releaseType: ReleaseTypeDto;

  @Exclude()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.releaseArtist.map((ra) => new AuthorDto(ra.author)),
  )
  releaseArtists: AuthorDto[];

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.releaseProducer.map((rp) => new AuthorDto(rp.author)),
  )
  releaseProducers: AuthorDto[];

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.releaseDesigner.map((rd) => new AuthorDto(rd.author)),
  )
  releaseDesigners: AuthorDto[];

  constructor(partial: Partial<AdminReleaseDto>) {
    Object.assign(this, partial);
  }
}

export class AdminReleasesResponseDto {
  @Expose()
  count: number;

  @Expose()
  @Type(() => AdminReleaseDto)
  releases: AdminReleaseDto[];

  constructor(count: number, releases: AdminReleaseDto[]) {
    this.count = count;
    this.releases = releases;
  }
}
