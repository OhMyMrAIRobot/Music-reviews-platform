import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupAuthorsE2e,
  seedAuthorsE2e,
} from './helpers/authors-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface AuthorsListResponseBody {
  meta: { count: number };
  items: unknown[];
}

interface AuthorDetailResponseBody {
  id: string;
  name: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('AuthorsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;
  let authorId: string;
  let authorTypeId: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedAuthorsE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    authorId = fixture.author.id;
    authorTypeId = fixture.authorTypeId;

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
    await cleanupAuthorsE2e(prisma, authorId, [regularUserId, adminUserId]);
    await prisma.$disconnect();
  });

  async function login(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  it('GET /authors returns list shape', async () => {
    const res = await request(app.getHttpServer()).get('/authors').expect(200);
    const body = res.body as AuthorsListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /authors/:id returns author', async () => {
    const res = await request(app.getHttpServer())
      .get(`/authors/${authorId}`)
      .expect(200);
    expect((res.body as AuthorDetailResponseBody).id).toBe(authorId);
  });

  it('GET /authors/:id returns 404 for missing id', () => {
    return request(app.getHttpServer())
      .get('/authors/cl000000000000000000000001')
      .expect(404);
  });

  it('POST /authors without auth returns 401', () => {
    return request(app.getHttpServer()).post('/authors').expect(401);
  });

  it('POST /authors as regular user returns 403', async () => {
    const token = await login(regularEmail, 'testpass123');
    return request(app.getHttpServer())
      .post('/authors')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'should-fail')
      .field('types[0]', authorTypeId)
      .expect(403);
  });

  it('POST /authors as admin creates author', async () => {
    const token = await login(adminEmail, 'testpass123');
    const name = `e2e-post-${Date.now()}`.slice(0, 50);
    const res = await request(app.getHttpServer())
      .post('/authors')
      .set('Authorization', `Bearer ${token}`)
      .field('name', name)
      .field('types[0]', authorTypeId)
      .expect(201);
    expect((res.body as AuthorDetailResponseBody).name).toBe(name);
    await prisma.author.deleteMany({ where: { name } });
  });

  it('PATCH /authors/:id as admin updates author', async () => {
    const token = await login(adminEmail, 'testpass123');
    const newName = `e2e-patch-${Date.now()}`.slice(0, 50);
    const res = await request(app.getHttpServer())
      .patch(`/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', newName)
      .expect(200);
    expect((res.body as AuthorDetailResponseBody).name).toBe(newName);
  });

  it('DELETE /authors/:id as admin removes author', async () => {
    const token = await login(adminEmail, 'testpass123');
    const name = `e2e-del-${Date.now()}`.slice(0, 50);
    const postRes = await request(app.getHttpServer())
      .post('/authors')
      .set('Authorization', `Bearer ${token}`)
      .field('name', name)
      .field('types[0]', authorTypeId)
      .expect(201);
    const delId = (postRes.body as AuthorDetailResponseBody).id;
    await request(app.getHttpServer())
      .delete(`/authors/${delId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
