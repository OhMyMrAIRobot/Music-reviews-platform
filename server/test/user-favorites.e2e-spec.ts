import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupUserFavoritesE2e,
  seedUserFavoritesE2e,
} from './helpers/user-favorites-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface AuthorLikesBody {
  meta: { count: number };
  items: unknown[];
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('User favorites (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let authorId: string;
  let releaseId: string;
  let reviewId: string;
  let releaseMediaId: string;
  let regularEmail: string;
  let adminEmail: string;
  const password = 'testpass123';

  async function login(email: string, pwd: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: pwd })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedUserFavoritesE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    authorId = fixture.author.id;
    releaseId = fixture.release.id;
    reviewId = fixture.review.id;
    releaseMediaId = fixture.releaseMediaId;
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
    await cleanupUserFavoritesE2e(prisma, reviewId, releaseId, authorId, [
      regularUserId,
      adminUserId,
    ]);
    await prisma.$disconnect();
  });

  describe('UserFavAuthorsController', () => {
    it('POST /user-fav-authors/:id without auth returns 401', () => {
      return request(app.getHttpServer())
        .post(`/user-fav-authors/${authorId}`)
        .expect(401);
    });

    it('POST and DELETE author favorite', async () => {
      const token = await login(regularEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/user-fav-authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
      await request(app.getHttpServer())
        .delete(`/user-fav-authors/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('UserFavReleasesController', () => {
    it('POST and DELETE release favorite', async () => {
      const token = await login(regularEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-releases/${releaseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/user-fav-releases/${releaseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
      await request(app.getHttpServer())
        .delete(`/user-fav-releases/${releaseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('UserFavMediaController', () => {
    it('POST favorite media and reject owner self-favorite', async () => {
      const userToken = await login(regularEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-media/${releaseMediaId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/user-fav-media/${releaseMediaId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(409);
      const adminToken = await login(adminEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-media/${releaseMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(409);
      await request(app.getHttpServer())
        .delete(`/user-fav-media/${releaseMediaId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
  });

  describe('UserFavReviewsController', () => {
    it('GET /user-fav-reviews/author-likes returns shape', async () => {
      const res = await request(app.getHttpServer())
        .get('/user-fav-reviews/author-likes')
        .expect(200);
      const body = res.body as AuthorLikesBody;
      expect(body.meta).toHaveProperty('count');
      expect(Array.isArray(body.items)).toBe(true);
    });

    it('POST favorite review, duplicate and own-review rules', async () => {
      const adminToken = await login(adminEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/user-fav-reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(409);
      const userToken = await login(regularEmail, password);
      await request(app.getHttpServer())
        .post(`/user-fav-reviews/${reviewId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(409);
      await request(app.getHttpServer())
        .delete(`/user-fav-reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
