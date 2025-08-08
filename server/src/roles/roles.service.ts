import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { UserRoleEnum } from './types/user-role.enum';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

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

  getValidRole(role: string) {
    return Object.values(UserRoleEnum).includes(role as UserRoleEnum)
      ? (role as UserRoleEnum)
      : UserRoleEnum.USER;
  }
}
