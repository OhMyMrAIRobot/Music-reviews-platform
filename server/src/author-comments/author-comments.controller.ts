import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthorCommentsService } from './author-comments.service';
import { FindAuthorCommentsByReleaseIdParams } from './dto/params/find-author-comments-by-release-id-params.dto';
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
    return this.authorCommentsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.authorCommentsService.delete(id, req.user.id);
  }
}
