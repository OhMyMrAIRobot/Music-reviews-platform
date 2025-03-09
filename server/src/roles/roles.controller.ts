import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from './type/userRole';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  async getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @Roles(UserRole.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Roles(UserRole.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Roles(UserRole.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<Role> {
    return this.roleService.deleteRole(id);
  }
}
