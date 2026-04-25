import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthorCommentsService } from './author-comments.service';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';

@Controller('admin/author-comments')
export class AdminAuthorCommentsController {
  constructor(private readonly authorCommentsService: AuthorCommentsService) {}
  /**
   * PATCH /admin/author-comments/:id
   *
   * Admin-only endpoint to update any author's comment. Requires ADMIN role
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAuthorCommentRequestDto) {
    return this.authorCommentsService.update(id, dto);
  }

  /**
   * DELETE /admin/author-comments/:id
   *
   * Admin-only endpoint to delete any author's comment. Requires ADMIN role
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  delete(@Param('id') id: string) {
    return this.authorCommentsService.delete(id);
  }
}
