import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { UserRoleEnum } from './types/user-role.enum';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns all roles available in the system.
   *
   * This performs a `findMany` on the `role` table and is intended for
   * administrative UIs and server-side validation.
   *
   * @returns Promise<Role[]> - list of role records.
   */
  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  /**
   * Returns a single role by its id.
   *
   * Throws `EntityNotFoundException` when no matching role is found.
   *
   * @param id - entity id of the role
   * @returns Promise<Role> - the found role
   * @throws EntityNotFoundException when not found
   */
  async findById(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new EntityNotFoundException('Роль', 'id', `${id}`);
    }
    return role;
  }

  /**
   * Finds a role by its human-readable name. The search is
   * case-insensitive.
   *
   * @param name - role name
   * @returns Promise<Role> - matching role
   * @throws EntityNotFoundException when no matching role exists
   */
  async findByName(name: string): Promise<Role> {
    const existingRole = await this.prisma.role.findFirst({
      where: { role: { equals: name, mode: 'insensitive' } },
    });

    if (!existingRole) {
      throw new EntityNotFoundException('Роль', 'названием', `${name}`);
    }

    return existingRole;
  }

  /**
   * Normalize a role string to a valid `UserRoleEnum` value.
   *
   * If the provided value is not recognized, the method returns the
   * default `UserRoleEnum.USER` role.
   *
   * @param role - incoming role string
   * @returns UserRoleEnum - normalized role value
   */
  getValidRole(role: string) {
    return Object.values(UserRoleEnum).includes(role as UserRoleEnum)
      ? (role as UserRoleEnum)
      : UserRoleEnum.USER;
  }
}
