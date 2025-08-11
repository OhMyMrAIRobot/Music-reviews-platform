import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthorCommentsService } from './author-comments.service';
import { FindAuthorCommentsByReleaseIdParams } from './dto/params/find-author-comments-by-release-id-params.dto';
import { FindAuthorCommentsQuery } from './dto/query/find-author-comments.query.dto';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';

@Controller('author-comments')
export class AuthorCommentsController {
  constructor(private readonly authorCommentsService: AuthorCommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateAuthorCommentRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.authorCommentsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: FindAuthorCommentsQuery) {
    return this.authorCommentsService.findAll(query);
  }

  @Get('release/:releaseId')
  findByReleaseId(@Param() params: FindAuthorCommentsByReleaseIdParams) {
    return this.authorCommentsService.findByReleaseId(params.releaseId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorCommentRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.authorCommentsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.authorCommentsService.delete(id, req.user.id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorCommentRequestDto,
  ) {
    return this.authorCommentsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  adminDelete(@Param('id') id: string) {
    return this.authorCommentsService.delete(id);
  }
}
