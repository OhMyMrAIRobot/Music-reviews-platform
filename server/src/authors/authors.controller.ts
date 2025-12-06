import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthorsService } from './authors.service';
import { CreateAuthorRequestDto } from './dto/request/create-author.request.dto';
import { AuthorsQueryDto } from './dto/request/query/authors.query.dto';
import { UpdateAuthorRequestDto } from './dto/request/update-author.request.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  /**
   * GET /authors
   *
   * Return a paginated list of authors. Supports filters from
   * `AuthorsQueryDto` such as `typeId`, `search`, `onlyRegistered`.
   */
  @Get()
  findAll(@Query() query: AuthorsQueryDto) {
    return this.authorsService.findAll(query);
  }

  /**
   * GET /authors/:id
   *
   * Return a single author by id in serialized `AuthorDto` form.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.authorsService.findById(id);
  }

  /**
   * POST /authors
   *
   * Create a new author. Requires admin/owner roles.
   * Accepts multipart uploads for `avatarImg` and `coverImg` fields
   * in addition to the JSON body described by `CreateAuthorRequestDto`.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarImg', maxCount: 1 },
      { name: 'coverImg', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
    @Body() dto: CreateAuthorRequestDto,
  ) {
    return this.authorsService.create(
      dto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  /**
   * PATCH /authors/:id
   *
   * Update an existing author. Requires admin/owner roles.
   * Accepts the partial JSON payload described by `UpdateAuthorRequestDto`
   * and optional multipart files for `avatarImg` and `coverImg`.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarImg', maxCount: 1 },
      { name: 'coverImg', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
    @Body() dto: UpdateAuthorRequestDto,
  ) {
    return this.authorsService.update(
      id,
      dto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  /**
   * DELETE /authors/:id
   *
   * Delete an author by id. Requires admin/owner roles.
   * Removes stored media files associated with the author as part of deletion.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
