import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Role> {
    return this.roleService.findById(id);
  }
}
