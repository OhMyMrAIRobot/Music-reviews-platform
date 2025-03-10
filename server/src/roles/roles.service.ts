import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { NoDataProvidedException } from '../exceptions/no-data.exception';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.prisma.role.findUnique({
      where: { role: createRoleDto.role },
    });

    if (existingRole) {
      throw new DuplicateFieldException(
        'Role',
        'name',
        `${createRoleDto.role}`,
      );
    }

    return this.prisma.role.create({
      data: { role: createRoleDto.role },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findById(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new EntityNotFoundException('Role', 'id', `${id}`);
    }
    return role;
  }

  async findByName(name: string = 'User'): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { role: name },
    });

    if (!role) {
      throw new EntityNotFoundException('Role', 'name', `${name}`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (!updateRoleDto || Object.keys(updateRoleDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findById(id);

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: string): Promise<Role> {
    await this.findById(id);

    const usersWithRole = await this.prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole != 0) {
      throw new ConflictException(`Role with id: ${id} is in use!`);
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
