import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupAuthorConfirmationsE2e,
  seedAuthorConfirmationsE2e,
} from './helpers/author-confirmations-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface ConfirmationsListBody {
  meta: { count: number };
  items: Array<{ id: string; status?: { status: string } }>;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)(
  'AuthorConfirmationsController (e2e)',
  () => {
    let app: INestApplication<App>;
    let prisma: PrismaClient;
    let regularUserId: string;
    let adminUserId: string;
    let regularEmail: string;
    let adminEmail: string;
    let authorId: string;
    let approvedStatusId: string;
    let confirmationId: string;
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
      const fixture = await seedAuthorConfirmationsE2e(prisma);
      regularUserId = fixture.regular.id;
      adminUserId = fixture.admin.id;
      regularEmail = fixture.regular.email;
      adminEmail = fixture.admin.email;
      authorId = fixture.author.id;
      approvedStatusId = fixture.approvedStatusId;

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

      const token = await login(regularEmail, password);
      await request(app.getHttpServer())
        .post('/author-confirmations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          authorIds: [authorId],
          confirmation: 'E2E proof text for author confirmation.',
        })
        .expect(201);
      const myRes = await request(app.getHttpServer())
        .get('/author-confirmations/my-confirmations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const myBody = myRes.body as ConfirmationsListBody;
      confirmationId = myBody.items[0].id;
    });

    afterAll(async () => {
      await app.close();
      await cleanupAuthorConfirmationsE2e(prisma, authorId, [
        regularUserId,
        adminUserId,
      ]);
      await prisma.$disconnect();
    });

    it('POST /author-confirmations without auth returns 401', () => {
      return request(app.getHttpServer())
        .post('/author-confirmations')
        .send({
          authorIds: [authorId],
          confirmation: 'Should fail without token.',
        })
        .expect(401);
    });

    it('GET /author-confirmations/my-confirmations returns list for user', async () => {
      const token = await login(regularEmail, password);
      const res = await request(app.getHttpServer())
        .get('/author-confirmations/my-confirmations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const body = res.body as ConfirmationsListBody;
      expect(body.meta.count).toBeGreaterThanOrEqual(1);
      expect(body.items.some((i) => i.id === confirmationId)).toBe(true);
    });

    it('GET /author-confirmations returns 403 for regular user', async () => {
      const token = await login(regularEmail, password);
      return request(app.getHttpServer())
        .get('/author-confirmations')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('GET /author-confirmations returns 200 for admin', async () => {
      const token = await login(adminEmail, password);
      const res = await request(app.getHttpServer())
        .get('/author-confirmations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const body = res.body as ConfirmationsListBody;
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.meta).toHaveProperty('count');
    });

    it('PATCH /author-confirmations/:id as admin updates status', async () => {
      const token = await login(adminEmail, password);
      const res = await request(app.getHttpServer())
        .patch(`/author-confirmations/${confirmationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ statusId: approvedStatusId })
        .expect(200);
      const body = res.body as { id: string; status: { status: string } };
      expect(body.id).toBe(confirmationId);
      expect(body.status.status).toBe('Принято');
    });

    it('DELETE /author-confirmations/:id as admin removes confirmation', async () => {
      const token = await login(adminEmail, password);
      await request(app.getHttpServer())
        .delete(`/author-confirmations/${confirmationId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  },
);
