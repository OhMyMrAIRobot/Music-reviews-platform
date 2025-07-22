import { BadRequestException, Injectable } from '@nestjs/common';
import { Author, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesService } from 'src/author-types/author-types.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { FileService } from 'src/file/files.service';
import {
  AuthorResponseDto,
  QueryAuthorResponseDto,
} from './dto/author.response.dto';
import { AuthorsQueryDto } from './dto/authors-query.dto';
import {
  AuthorQueryResponse,
  AuthorsResponseDto,
} from './dto/authors.response.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import {
  AuthorDto,
  FindAuthorsResponseDto,
} from './dto/find-authors-response.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorTypesService: AuthorTypesService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createAuthorDto: CreateAuthorDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Author> {
    const typesExist = await this.authorTypesService.checkTypesExist(
      createAuthorDto.types,
    );

    if (!typesExist) {
      throw new BadRequestException(
        'Один или несколько указанных типов не существуют',
      );
    }

    const existingAuthor = await this.findByName(createAuthorDto.name);

    if (existingAuthor) {
      throw new DuplicateFieldException(
        'Автор',
        'именем',
        `${existingAuthor.name}`,
      );
    }

    const avatarImg = avatar
      ? await this.fileService.saveFile(avatar, 'authors', 'avatars')
      : '';

    const coverImg = cover
      ? await this.fileService.saveFile(cover, 'authors', 'covers')
      : '';

    const authorTypeConnections = createAuthorDto.types.map((typeId) => ({
      authorType: {
        connect: { id: typeId },
      },
    }));

    const created = await this.prisma.author.create({
      data: {
        name: createAuthorDto.name,
        types: {
          create: authorTypeConnections,
        },
        avatarImg,
        coverImg,
      },
      include: {
        types: {
          include: {
            authorType: true,
          },
        },
      },
    });

    return plainToInstance(AuthorDto, created);
  }

  async findAll(query: AuthorsQueryDto): Promise<FindAuthorsResponseDto> {
    const { limit, offset = 0, query: name, typeId } = query;

    if (typeId) {
      await this.authorTypesService.findOne(typeId);
    }

    const where: Prisma.AuthorWhereInput = {
      AND: [
        {
          types: typeId
            ? {
                some: {
                  authorTypeId: typeId,
                },
              }
            : undefined,
        },
        {
          name: {
            contains: name ?? '',
            mode: 'insensitive',
          },
        },
      ],
    };

    const [count, authors] = await Promise.all([
      this.prisma.author.count({ where }),
      this.prisma.author.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          types: {
            include: {
              authorType: true,
            },
          },
        },
      }),
    ]);

    return plainToInstance(FindAuthorsResponseDto, { count, authors });
  }

  async checkAuthorsExist(authorIds: string[]): Promise<boolean> {
    if (authorIds.length === 0) return true;
    const existingAuthors = await this.prisma.author.findMany({
      where: {
        id: { in: authorIds },
      },
      select: { id: true },
    });
    return existingAuthors.length === authorIds.length;
  }

  async findOne(id: string): Promise<Author> {
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      throw new EntityNotFoundException('Автор', 'id', `${id}`);
    }

    return existingAuthor;
  }

  async update(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Author> {
    if (Object.keys(updateAuthorDto).length === 0 && !avatar && !cover) {
      throw new NoDataProvidedException();
    }

    const author = await this.findOne(id);

    if (updateAuthorDto.types) {
      const typesExist = await this.authorTypesService.checkTypesExist(
        updateAuthorDto.types,
      );

      if (!typesExist) {
        throw new BadRequestException(
          'Один или несколько указанных типов не существуют',
        );
      }
    }

    if (updateAuthorDto.name) {
      const existingAuthor = await this.findByName(updateAuthorDto.name);

      if (existingAuthor) {
        throw new DuplicateFieldException(
          'Автор',
          'именем',
          `${existingAuthor.name}`,
        );
      }
    }

    let avatarImg: string | undefined = undefined;
    if (avatar) {
      avatarImg = await this.fileService.saveFile(avatar, 'authors', 'avatars');
    }

    let coverImg: string | undefined = undefined;
    if (cover) {
      coverImg = await this.fileService.saveFile(cover, 'authors', 'covers');
    }

    const data: Prisma.AuthorUpdateInput = {
      name: updateAuthorDto.name,
      avatarImg,
      coverImg,
    };

    if (updateAuthorDto.types) {
      await this.prisma.authorOnType.deleteMany({
        where: { authorId: id },
      });

      data.types = {
        create: updateAuthorDto.types.map((typeId) => ({
          authorType: { connect: { id: typeId } },
        })),
      };
    }

    const updated = await this.prisma.author.update({
      where: { id },
      data,
      include: {
        types: {
          include: {
            authorType: true,
          },
        },
      },
    });

    if (avatar && author.avatarImg !== '') {
      await this.fileService.deleteFile('authors/avatars/' + author.avatarImg);
    }

    if (cover && author.coverImg !== '') {
      await this.fileService.deleteFile('authors/covers/' + author.coverImg);
    }

    return plainToInstance(AuthorDto, updated);
  }

  async remove(id: string): Promise<Author> {
    await this.findOne(id);

    const author = await this.prisma.author.delete({
      where: { id },
    });

    if (author.avatarImg !== '') {
      await this.fileService.deleteFile('authors/avatars/' + author.avatarImg);
    }
    if (author.coverImg !== '') {
      await this.fileService.deleteFile('authors/covers/' + author.coverImg);
    }

    return author;
  }

  async findById(id: string): Promise<AuthorResponseDto> {
    const rawQuery = `
        WITH all_release_types AS (
            SELECT type AS release_type FROM "Release_types"
        ),

        authors_with_types AS (
            SELECT
                a.id AS author_id,
                rt.release_type
            FROM "Authors" a
            CROSS JOIN all_release_types rt
        ),

        author_releases AS (
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_producers" rp ON a.id = rp.author_id
            LEFT JOIN "Releases" r ON rp.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
            
            UNION
            
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_artists" ra ON a.id = ra.author_id
            LEFT JOIN "Releases" r ON ra.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
            
            UNION
            
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_designers" rd ON a.id = rd.author_id
            LEFT JOIN "Releases" r ON rd.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
        ),

        release_ratings_aggregated AS (
            SELECT
                ar.author_id,
                ar.release_type,
                rrt.type AS rating_type,
                AVG(rr.total) AS avg_rating
            FROM author_releases ar
            JOIN "Release_ratings" rr ON ar.release_id = rr.release_id
            JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
            WHERE rr.total > 0
            GROUP BY ar.author_id, ar.release_type, rrt.type
        ),

        release_stats AS (
            SELECT
                awt.author_id,
                awt.release_type,
                CEIL(MAX(CASE WHEN rra.rating_type = 'no_text' THEN rra.avg_rating ELSE NULL END)) AS avg_no_text,
                CEIL(MAX(CASE WHEN rra.rating_type = 'with_text' THEN rra.avg_rating ELSE NULL END)) AS avg_with_text,
                CEIL(MAX(CASE WHEN rra.rating_type = 'super_user' THEN rra.avg_rating ELSE NULL END)) AS avg_super_user
            FROM authors_with_types awt
            LEFT JOIN release_ratings_aggregated rra ON
                rra.author_id = awt.author_id AND
                rra.release_type = awt.release_type
            GROUP BY awt.author_id, awt.release_type
        )

        SELECT
            a.id,
            a.avatar_img AS img,
            a.cover_img AS cover,
            a.name,
            COUNT(DISTINCT ufa.user_id)::int AS likes_count,
            json_agg(DISTINCT jsonb_build_object(
                    'userId', ufa.user_id, 
                    'authorId', ufa.author_id
            )) as user_fav_ids,
            jsonb_agg(DISTINCT jsonb_build_object('id', at.id, 'type', at.type)) AS author_types,
            jsonb_agg(
                jsonb_build_object(
                    'type', rs.release_type,
                    'ratings', jsonb_build_object(
                        'no_text', rs.avg_no_text,
                        'with_text', rs.avg_with_text,
                        'super_user', rs.avg_super_user
                    )
                )
            ) FILTER (WHERE rs.release_type IS NOT NULL) AS release_type_stats
        FROM "Authors" a
        LEFT JOIN "Authors_on_types" aot ON a.id = aot.author_id
        LEFT JOIN "Author_types" at ON aot.author_type_id = at.id
        LEFT JOIN release_stats rs ON a.id = rs.author_id
        LEFT JOIN "User_fav_authors" ufa ON a.id = ufa.author_id
        WHERE (a.id = '${id}')
        GROUP BY a.id, a.name, a.avatar_img
    `;

    const author =
      await this.prisma.$queryRawUnsafe<QueryAuthorResponseDto>(rawQuery);
    return author[0];
  }

  async findAuthors(query: AuthorsQueryDto): Promise<AuthorsResponseDto> {
    const typeId = query.typeId ? `'${query.typeId}'` : null;
    const name = query.query ?? null;
    const limit = query.limit ? query.limit : 20;
    const offset = query.offset ? query.offset : 0;

    if (query.typeId) {
      await this.authorTypesService.findOne(query.typeId);
    }

    const count = await this.prisma.author.count({
      where: {
        AND: [
          {
            types: query.typeId
              ? {
                  some: {
                    authorTypeId: query.typeId,
                  },
                }
              : undefined,
          },
          {
            name: {
              contains: name ?? '',
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const rawQuery = `
        WITH all_release_types AS (
            SELECT type AS release_type FROM "Release_types"
        ),

        authors_with_types AS (
            SELECT
                a.id AS author_id,
                rt.release_type
            FROM "Authors" a
            CROSS JOIN all_release_types rt
        ),

        author_releases AS (
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_producers" rp ON a.id = rp.author_id
            LEFT JOIN "Releases" r ON rp.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
            
            UNION
            
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_artists" ra ON a.id = ra.author_id
            LEFT JOIN "Releases" r ON ra.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
            
            UNION
            
            SELECT DISTINCT
                a.id AS author_id,
                r.id AS release_id,
                rt.type AS release_type
            FROM "Authors" a
            LEFT JOIN "Release_designers" rd ON a.id = rd.author_id
            LEFT JOIN "Releases" r ON rd.release_id = r.id
            LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
            WHERE r.id IS NOT NULL AND rt.type IS NOT NULL
        ),

        release_ratings_aggregated AS (
            SELECT
                ar.author_id,
                ar.release_type,
                rrt.type AS rating_type,
                AVG(rr.total) AS avg_rating
            FROM author_releases ar
            JOIN "Release_ratings" rr ON ar.release_id = rr.release_id
            JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
            WHERE rr.total > 0
            GROUP BY ar.author_id, ar.release_type, rrt.type
        ),

        release_stats AS (
            SELECT
                awt.author_id,
                awt.release_type,
                CEIL(MAX(CASE WHEN rra.rating_type = 'no_text' THEN rra.avg_rating ELSE NULL END)) AS avg_no_text,
                CEIL(MAX(CASE WHEN rra.rating_type = 'with_text' THEN rra.avg_rating ELSE NULL END)) AS avg_with_text,
                CEIL(MAX(CASE WHEN rra.rating_type = 'super_user' THEN rra.avg_rating ELSE NULL END)) AS avg_super_user
            FROM authors_with_types awt
            LEFT JOIN release_ratings_aggregated rra ON
                rra.author_id = awt.author_id AND
                rra.release_type = awt.release_type
            GROUP BY awt.author_id, awt.release_type
        )

        SELECT
            a.id,
            a.avatar_img AS img,
            a.cover_img AS cover,
            a.name,
            COUNT(DISTINCT ufa.user_id)::int AS likes_count,
            json_agg(DISTINCT jsonb_build_object(
                    'userId', ufa.user_id, 
                    'authorId', ufa.author_id
            )) as user_fav_ids,
            jsonb_agg(DISTINCT jsonb_build_object('id', at.id, 'type', at.type)) AS author_types,
            jsonb_agg(
                jsonb_build_object(
                    'type', rs.release_type,
                    'ratings', jsonb_build_object(
                        'no_text', rs.avg_no_text,
                        'with_text', rs.avg_with_text,
                        'super_user', rs.avg_super_user
                    )
                )
            ) FILTER (WHERE rs.release_type IS NOT NULL) AS release_type_stats
        FROM "Authors" a
        LEFT JOIN "Authors_on_types" aot ON a.id = aot.author_id
        LEFT JOIN "Author_types" at ON aot.author_type_id = at.id
        LEFT JOIN release_stats rs ON a.id = rs.author_id
        LEFT JOIN "User_fav_authors" ufa ON a.id = ufa.author_id
        WHERE (${typeId} IS NULL OR at.id = ${typeId}) AND
          (${name ? `'${name}'` : name}::text IS NULL OR a.name ILIKE '%' || ${name ? `'${name}'` : name} || '%')
        GROUP BY a.id, a.name, a.avatar_img
        ORDER BY a.id
        LIMIT ${limit} OFFSET ${offset};
        `;

    const authors =
      await this.prisma.$queryRawUnsafe<AuthorQueryResponse[]>(rawQuery);

    return { count, authors };
  }

  private async findByName(name: string): Promise<Author | null> {
    return this.prisma.author.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }
}
