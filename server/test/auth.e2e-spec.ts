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
  user: { id: string; email: string };
}

interface RefreshResponseBody {
  accessToken: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  const password = 'testpass123';

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_ACTION_SECRET =
      process.env.JWT_ACTION_SECRET || 'e2e-jwt-action-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedUsersE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;

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

  it('POST /auth/login returns access token and sets refresh cookie', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: regularEmail, password })
      .expect(200)
      .expect((res) => {
        const body = res.body as LoginResponseBody;
        expect(body.accessToken).toBeDefined();
        expect(body.user.email).toBe(regularEmail);
        const setCookie = res.headers['set-cookie'];
        let cookies: string[] = [];
        if (Array.isArray(setCookie)) {
          cookies = setCookie.filter((c): c is string => typeof c === 'string');
        } else if (typeof setCookie === 'string') {
          cookies = [setCookie];
        }
        expect(cookies.some((c) => c.startsWith('refreshToken='))).toBe(true);
      });
  });

  it('POST /auth/login with wrong password returns 401', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: regularEmail, password: 'wrong-password' })
      .expect(401);
  });

  it('POST /auth/refresh without cookie returns 401', () => {
    return request(app.getHttpServer()).post('/auth/refresh').expect(401);
  });

  it('POST /auth/refresh with valid cookie returns new access token', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: regularEmail, password })
      .expect(200);

    const res = await agent.post('/auth/refresh').expect(200);
    const body = res.body as RefreshResponseBody;
    expect(body.accessToken).toBeDefined();
  });

  it('POST /auth/logout clears session so refresh fails', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: regularEmail, password })
      .expect(200);

    await agent.post('/auth/logout').expect(200);
    await agent.post('/auth/refresh').expect(401);
  });
});
