import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  /**
   * GET /roles
   *
   * Returns all available roles.
   *
   * @returns Promise<Role[]>
   */
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  /**
   * GET /roles/:id
   *
   * Returns a single role by id. If no matching role is found, the
   * service throws `EntityNotFoundException` which is converted to a
   * 404 response by the global exception filter.
   *
   * @param id - role entity id
   * @returns Promise<Role>
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Role> {
    return this.roleService.findById(id);
  }
}
