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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { AuthorsService } from './authors.service';
import { CreateAuthorRequestDto } from './dto/request/create-author.request.dto';
import { FindAuthorParamsDto } from './dto/request/find-author-params.dto';
import { FindAuthorsQueryDto } from './dto/request/find-authors.query.dto';
import { UpdateAuthorRequestDto } from './dto/request/update-author.request.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAuthors(@Query() query: FindAuthorsQueryDto) {
    return this.authorsService.findAuthors(query);
  }

  @Get('details/:id')
  findById(@Param() params: FindAuthorParamsDto) {
    return this.authorsService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Post()
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
    @Body() createAuthorDto: CreateAuthorRequestDto,
  ) {
    return this.authorsService.create(
      createAuthorDto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get('admin')
  findAll(@Query() query: FindAuthorsQueryDto) {
    return this.authorsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch(':id')
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
    @Body() updateAuthorDto: UpdateAuthorRequestDto,
  ) {
    return this.authorsService.update(
      id,
      updateAuthorDto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
