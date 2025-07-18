import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatDateCreatedAt } from 'src/users/utils/format-date-created-at';

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
    ReleaseType: true;
    ReleaseArtist: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    ReleaseProducer: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    ReleaseDesigner: {
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
  @Transform(({ value }) => formatDateCreatedAt(value as Date))
  publishDate: string;

  @Expose()
  img: string;

  @Exclude()
  releaseTypeId: string;

  @Expose()
  @Type(() => ReleaseTypeDto)
  @Transform(
    ({ obj }: { obj: ReleaseWithRelations }) =>
      new ReleaseTypeDto(obj.ReleaseType),
  )
  releaseType: ReleaseTypeDto;

  @Exclude()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.ReleaseArtist.map((ra) => new AuthorDto(ra.author)),
  )
  releaseArtists: AuthorDto[];

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.ReleaseProducer.map((rp) => new AuthorDto(rp.author)),
  )
  releaseProducers: AuthorDto[];

  @Expose()
  @Type(() => AuthorDto)
  @Transform(({ obj }: { obj: ReleaseWithRelations }) =>
    obj.ReleaseDesigner.map((rd) => new AuthorDto(rd.author)),
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
