import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupReviewsE2e,
  seedReviewsE2e,
} from './helpers/reviews-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface ReviewsListResponseBody {
  meta: { count: number };
  items: unknown[];
}

interface ReviewDetailResponseBody {
  id: string | null;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('ReviewsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;
  let releaseId: string;
  let authorId: string;
  let reviewId: string;
  let fixtureReviewId: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedReviewsE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    releaseId = fixture.release.id;
    authorId = fixture.author.id;
    reviewId = fixture.review.id;
    fixtureReviewId = fixture.review.id;

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
    await cleanupReviewsE2e(prisma, fixtureReviewId, releaseId, authorId, [
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

  const scoresBody = (rid: string) => ({
    rhymes: 7,
    structure: 7,
    realization: 7,
    individuality: 7,
    atmosphere: 7,
    releaseId: rid,
  });

  it('GET /reviews returns list shape', async () => {
    const res = await request(app.getHttpServer()).get('/reviews').expect(200);
    const body = res.body as ReviewsListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /reviews/:id returns review', async () => {
    const res = await request(app.getHttpServer())
      .get(`/reviews/${reviewId}`)
      .expect(200);
    expect((res.body as ReviewDetailResponseBody).id).toBe(reviewId);
  });

  it('GET /reviews/:id returns 404 for missing id', () => {
    return request(app.getHttpServer())
      .get('/reviews/cl000000000000000000000001')
      .expect(404);
  });

  it('POST /reviews without auth returns 401', () => {
    return request(app.getHttpServer())
      .post('/reviews')
      .send(scoresBody(releaseId))
      .expect(401);
  });

  it('POST /reviews returns 409 when duplicate user+release', async () => {
    const token = await login(regularEmail, 'testpass123');
    return request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(scoresBody(releaseId))
      .expect(409);
  });

  it('POST /reviews as admin creates review', async () => {
    const token = await login(adminEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(scoresBody(releaseId))
      .expect(201);
    const id = (res.body as ReviewDetailResponseBody).id;
    expect(id).toBeDefined();
    await prisma.review.deleteMany({ where: { id: id as string } });
  });

  it('PATCH /reviews/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, 'testpass123');
    return request(app.getHttpServer())
      .patch(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ atmosphere: 8 })
      .expect(403);
  });

  it('PATCH /reviews/:id as owner updates review', async () => {
    const token = await login(regularEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .patch(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ atmosphere: 8 })
      .expect(200);
    expect((res.body as ReviewDetailResponseBody).id).toBe(reviewId);
  });

  it('DELETE /reviews/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, 'testpass123');
    return request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('PATCH /admin/reviews/:id as admin updates review', async () => {
    const token = await login(adminEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .patch(`/admin/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ atmosphere: 9 })
      .expect(200);
    expect((res.body as ReviewDetailResponseBody).id).toBe(reviewId);
  });

  it('DELETE /admin/reviews/:id as admin removes review', async () => {
    const token = await login(adminEmail, 'testpass123');
    const postRes = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(scoresBody(releaseId))
      .expect(201);
    const newId = (postRes.body as ReviewDetailResponseBody).id as string;
    await request(app.getHttpServer())
      .delete(`/admin/reviews/${newId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('DELETE /reviews/:id as owner removes review', async () => {
    const token = await login(regularEmail, 'testpass123');
    await request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
