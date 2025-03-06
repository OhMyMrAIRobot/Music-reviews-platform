import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  async getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<Role> {
    return this.roleService.deleteRole(id);
  }
}
