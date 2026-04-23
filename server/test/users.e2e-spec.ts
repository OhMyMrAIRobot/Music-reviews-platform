import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import { cleanupUsersE2e, seedUsersE2e } from './helpers/users-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface UsersListResponseBody {
  meta: { count: number };
  items: unknown[];
}

interface UserDetailsResponseBody {
  id: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedUsersE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await cleanupUsersE2e(prisma, [regularUserId, adminUserId]);
    await prisma.$disconnect();
  });

  async function login(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  it('GET /users without auth returns 401', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('GET /users as regular user returns 403', async () => {
    const token = await login(regularEmail, 'testpass123');
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('GET /users as admin returns list shape', async () => {
    const token = await login(adminEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const body = res.body as UsersListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /users/:id as admin returns 200 for existing user', async () => {
    const token = await login(adminEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .get(`/users/${regularUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect((res.body as UserDetailsResponseBody).id).toBe(regularUserId);
  });

  it('GET /users/:id as admin returns 404 for missing id', async () => {
    const token = await login(adminEmail, 'testpass123');
    return request(app.getHttpServer())
      .get('/users/cl000000000000000000000001')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('PATCH /users with auth updates profile and returns 200', async () => {
    const token = await login(regularEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'testpass123' })
      .expect(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('emailSent');
  });

  it('PATCH /users/:id as admin updates other user', async () => {
    const token = await login(adminEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .patch(`/users/${regularUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: true })
      .expect(200);
    expect((res.body as UserDetailsResponseBody).id).toBe(regularUserId);
  });
});
