import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { EntityInUseException } from 'src/exceptions/entity-in-use.exception';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../exceptions/no-data.exception';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRoleEnum } from './types/user-role.enum';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    await this.checkDuplicateRole(createRoleDto.role);

    return this.prisma.role.create({
      data: createRoleDto,
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
      throw new EntityNotFoundException('Роль', 'id', `${id}`);
    }
    return role;
  }

  async findByName(name: string = 'User'): Promise<Role> {
    const existingRole = await this.prisma.role.findFirst({
      where: { role: { equals: name, mode: 'insensitive' } },
    });

    if (!existingRole) {
      throw new EntityNotFoundException('Роль', 'названием', `${name}`);
    }

    return existingRole;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (!updateRoleDto || Object.keys(updateRoleDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findById(id);
    await this.checkDuplicateRole(updateRoleDto.role ?? '');

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
      throw new EntityInUseException('Роль', 'id', `${id}`);
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async checkDuplicateRole(name: string) {
    const existingRole = await this.prisma.role.findFirst({
      where: { role: { equals: name, mode: 'insensitive' } },
    });
    if (existingRole) {
      throw new DuplicateFieldException(
        'Роль',
        'названием',
        `${existingRole.role}`,
      );
    }
  }

  getValidRole(role: string) {
    return Object.values(UserRoleEnum).includes(role as UserRoleEnum)
      ? (role as UserRoleEnum)
      : UserRoleEnum.USER;
  }
}
