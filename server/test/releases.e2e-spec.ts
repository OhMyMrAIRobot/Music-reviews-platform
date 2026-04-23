import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupReleasesE2e,
  seedReleasesE2e,
} from './helpers/releases-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface ReleasesListResponseBody {
  meta: { count: number };
  items: unknown[];
}

interface ReleaseDetailResponseBody {
  id: string;
  title: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('ReleasesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;
  let releaseId: string;
  let authorId: string;
  let releaseTypeId: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedReleasesE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    releaseId = fixture.release.id;
    authorId = fixture.author.id;
    releaseTypeId = fixture.releaseTypeId;

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
    await cleanupReleasesE2e(prisma, releaseId, authorId, [
      regularUserId,
      adminUserId,
    ]);
    await prisma.$disconnect();
  });

  async function login(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  it('GET /releases returns list shape', async () => {
    const res = await request(app.getHttpServer()).get('/releases').expect(200);
    const body = res.body as ReleasesListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /releases/:id returns release', async () => {
    const res = await request(app.getHttpServer())
      .get(`/releases/${releaseId}`)
      .expect(200);
    expect((res.body as ReleaseDetailResponseBody).id).toBe(releaseId);
  });

  it('GET /releases/:id returns 404 for missing id', () => {
    return request(app.getHttpServer())
      .get('/releases/cl000000000000000000000001')
      .expect(404);
  });

  it('POST /releases without auth returns 401', () => {
    return request(app.getHttpServer()).post('/releases').expect(401);
  });

  it('POST /releases as regular user returns 403', async () => {
    const token = await login(regularEmail, 'testpass123');
    return request(app.getHttpServer())
      .post('/releases')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'x')
      .field('publishDate', new Date('2018-01-01').toISOString())
      .field('releaseTypeId', releaseTypeId)
      .expect(403);
  });

  it('POST /releases as admin creates release', async () => {
    const token = await login(adminEmail, 'testpass123');
    const title = `e2e-post-rel-${Date.now()}`.slice(0, 50);
    const res = await request(app.getHttpServer())
      .post('/releases')
      .set('Authorization', `Bearer ${token}`)
      .field('title', title)
      .field('publishDate', new Date('2018-05-10T12:00:00.000Z').toISOString())
      .field('releaseTypeId', releaseTypeId)
      .field('releaseArtists[0]', authorId)
      .expect(201);
    expect((res.body as ReleaseDetailResponseBody).title).toBe(title);
    await prisma.release.deleteMany({ where: { title } });
  });

  it('PATCH /releases/:id as admin updates release', async () => {
    const token = await login(adminEmail, 'testpass123');
    const newTitle = `e2e-patch-rel-${Date.now()}`.slice(0, 50);
    const res = await request(app.getHttpServer())
      .patch(`/releases/${releaseId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', newTitle)
      .expect(200);
    expect((res.body as ReleaseDetailResponseBody).title).toBe(newTitle);
  });

  it('DELETE /releases/:id as admin removes release', async () => {
    const token = await login(adminEmail, 'testpass123');
    const title = `e2e-del-rel-${Date.now()}`.slice(0, 50);
    const postRes = await request(app.getHttpServer())
      .post('/releases')
      .set('Authorization', `Bearer ${token}`)
      .field('title', title)
      .field('publishDate', new Date('2017-03-20T12:00:00.000Z').toISOString())
      .field('releaseTypeId', releaseTypeId)
      .field('releaseArtists[0]', authorId)
      .expect(201);
    const delId = (postRes.body as ReleaseDetailResponseBody).id;
    await request(app.getHttpServer())
      .delete(`/releases/${delId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
