import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupFeedbackE2e,
  seedFeedbackE2e,
} from './helpers/feedback-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface FeedbackListBody {
  meta: { count: number };
  items: Array<{ id: string }>;
}

interface FeedbackDetailBody {
  id: string;
  email: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('FeedbackController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularEmail: string;
  let adminEmail: string;
  let readStatusId: string;
  let answeredStatusId: string;
  let userIds: string[];
  const feedbackIds: string[] = [];
  const password = 'testpass123';

  let feedbackId: string;

  function feedbackBody() {
    return {
      email: `e2e-feedback-msg-${Date.now()}@test.local`,
      title: 'Title',
      message: 'm'.repeat(100),
    };
  }

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedFeedbackE2e(prisma);
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    readStatusId = fixture.readStatusId;
    answeredStatusId = fixture.answeredStatusId;
    userIds = [fixture.regular.id, fixture.admin.id];

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
    await cleanupFeedbackE2e(prisma, feedbackIds, userIds);
    await prisma.$disconnect();
  });

  async function login(email: string, pwd: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: pwd })
      .expect(200);
    return (res.body as LoginResponseBody).accessToken;
  }

  it('POST /feedback creates without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/feedback')
      .send(feedbackBody())
      .expect(201);
    const body = res.body as FeedbackDetailBody;
    expect(body.id).toBeDefined();
    expect(body.email).toContain('@test.local');
    feedbackId = body.id;
    feedbackIds.push(feedbackId);
  });

  it('GET /feedback without auth returns 401', () => {
    return request(app.getHttpServer()).get('/feedback').expect(401);
  });

  it('GET /feedback returns 403 for regular user', async () => {
    const token = await login(regularEmail, password);
    return request(app.getHttpServer())
      .get('/feedback')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('GET /feedback returns 200 for admin', async () => {
    const token = await login(adminEmail, password);
    const res = await request(app.getHttpServer())
      .get('/feedback')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const body = res.body as FeedbackListBody;
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /feedback/:id returns 200 for admin', async () => {
    const token = await login(adminEmail, password);
    const res = await request(app.getHttpServer())
      .get(`/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect((res.body as FeedbackDetailBody).id).toBe(feedbackId);
  });

  it('PATCH /feedback/:id sets READ status', async () => {
    const token = await login(adminEmail, password);
    const res = await request(app.getHttpServer())
      .patch(`/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ feedbackStatusId: readStatusId })
      .expect(200);
    expect((res.body as FeedbackDetailBody).id).toBe(feedbackId);
  });

  it('PATCH /feedback/:id to ANSWERED without reply returns 409', async () => {
    const token = await login(adminEmail, password);
    return request(app.getHttpServer())
      .patch(`/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ feedbackStatusId: answeredStatusId })
      .expect(409);
  });

  it('DELETE /feedback/:id returns 403 for regular user', async () => {
    const token = await login(regularEmail, password);
    return request(app.getHttpServer())
      .delete(`/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('DELETE /feedback/:id returns 200 for admin', async () => {
    const token = await login(adminEmail, password);
    await request(app.getHttpServer())
      .delete(`/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
