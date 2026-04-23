import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../../src/roles/types/user-role.enum';

export async function seedUsersE2e(prisma: PrismaClient) {
  const password = await bcrypt.hash('testpass123', 10);
  const userRole = await prisma.role.findFirst({
    where: { role: UserRoleEnum.USER },
  });
  const adminRole = await prisma.role.findFirst({
    where: { role: UserRoleEnum.ADMIN },
  });
  if (!userRole || !adminRole) {
    throw new Error(
      'Roles USER and ADMIN must exist in the database (run seed or migrations).',
    );
  }

  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
  const regNick = `e2er${suffix}`.slice(0, 20);
  const admNick = `e2ea${suffix}`.slice(0, 20);

  const regular = await prisma.user.create({
    data: {
      email: `e2e-users-reg-${suffix}@test.local`,
      nickname: regNick.length >= 3 ? regNick : `e2e${suffix}`.slice(0, 20),
      password,
      isActive: true,
      roleId: userRole.id,
    },
  });
  await prisma.userProfile.create({ data: { userId: regular.id } });

  const admin = await prisma.user.create({
    data: {
      email: `e2e-users-adm-${suffix}@test.local`,
      nickname: admNick.length >= 3 ? admNick : `e2b${suffix}`.slice(0, 20),
      password,
      isActive: true,
      roleId: adminRole.id,
    },
  });
  await prisma.userProfile.create({ data: { userId: admin.id } });

  return { regular, admin, suffix };
}

export async function cleanupUsersE2e(prisma: PrismaClient, userIds: string[]) {
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}
