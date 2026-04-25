import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupAuthorCommentsE2e,
  seedAuthorCommentsE2e,
} from './helpers/author-comments-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface AuthorCommentsListResponseBody {
  meta: { count: number };
  items: Array<{ id: string; title?: string }>;
}

interface AuthorCommentDetailBody {
  id: string;
  title: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('AuthorCommentsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;
  let releaseId: string;
  let authorId: string;
  let authorCommentId: string;

  const password = 'testpass123';

  function commentPayload(relId: string) {
    return {
      title: 'E2E Title',
      text: 'y'.repeat(300),
      releaseId: relId,
    };
  }

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedAuthorCommentsE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    releaseId = fixture.release.id;
    authorId = fixture.author.id;

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
    await cleanupAuthorCommentsE2e(prisma, releaseId, authorId, [
      regularUserId,
      adminUserId,
    ]);
    await prisma.$disconnect();
  });

  async function login(email: string, pwd: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: pwd })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  it('GET /author-comments returns list shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/author-comments')
      .expect(200);
    const body = res.body as AuthorCommentsListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /author-comments/release/:releaseId returns list shape', async () => {
    const res = await request(app.getHttpServer())
      .get(`/author-comments/release/${releaseId}`)
      .expect(200);
    const body = res.body as AuthorCommentsListResponseBody;
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /author-comments/release/:id returns 404 for missing release', () => {
    return request(app.getHttpServer())
      .get('/author-comments/release/cl000000000000000000000001')
      .expect(404);
  });

  it('POST /author-comments without auth returns 401', () => {
    return request(app.getHttpServer())
      .post('/author-comments')
      .send(commentPayload(releaseId))
      .expect(401);
  });

  it('POST /author-comments as release author creates comment', async () => {
    const token = await login(regularEmail, password);
    const res = await request(app.getHttpServer())
      .post('/author-comments')
      .set('Authorization', `Bearer ${token}`)
      .send(commentPayload(releaseId))
      .expect(201);
    const body = res.body as AuthorCommentDetailBody;
    expect(body.id).toBeDefined();
    authorCommentId = body.id;
  });

  it('POST /author-comments returns 403 when duplicate user+release', async () => {
    const token = await login(regularEmail, password);
    return request(app.getHttpServer())
      .post('/author-comments')
      .set('Authorization', `Bearer ${token}`)
      .send(commentPayload(releaseId))
      .expect(403);
  });

  it('PATCH /author-comments/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, password);
    return request(app.getHttpServer())
      .patch(`/author-comments/${authorCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Other Title' })
      .expect(403);
  });

  it('PATCH /author-comments/:id as owner updates comment', async () => {
    const token = await login(regularEmail, password);
    const res = await request(app.getHttpServer())
      .patch(`/author-comments/${authorCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' })
      .expect(200);
    expect((res.body as AuthorCommentDetailBody).id).toBe(authorCommentId);
  });

  it('DELETE /author-comments/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, password);
    return request(app.getHttpServer())
      .delete(`/author-comments/${authorCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('PATCH /admin/author-comments/:id as admin updates comment', async () => {
    const token = await login(adminEmail, password);
    const res = await request(app.getHttpServer())
      .patch(`/admin/author-comments/${authorCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Admin Title' })
      .expect(200);
    expect((res.body as AuthorCommentDetailBody).id).toBe(authorCommentId);
  });

  it('DELETE /admin/author-comments/:id as admin removes comment', async () => {
    const token = await login(adminEmail, password);
    await request(app.getHttpServer())
      .delete(`/admin/author-comments/${authorCommentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
