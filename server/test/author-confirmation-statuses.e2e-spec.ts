import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';

interface StatusRow {
  id: string;
  status: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)(
  'AuthorConfirmationStatusesController (e2e)',
  () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
      process.env.JWT_ACCESS_SECRET =
        process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
      process.env.JWT_REFRESH_SECRET =
        process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
      process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

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
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('GET /author-confirmation-statuses returns a list', async () => {
      const res = await request(app.getHttpServer())
        .get('/author-confirmation-statuses')
        .expect(200);
      const body = res.body as StatusRow[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('GET /author-confirmation-statuses/:id returns 404 for missing id', () => {
      return request(app.getHttpServer())
        .get('/author-confirmation-statuses/cl000000000000000000000001')
        .expect(404);
    });

    it('GET /author-confirmation-statuses/:id returns one status', async () => {
      const listRes = await request(app.getHttpServer())
        .get('/author-confirmation-statuses')
        .expect(200);
      const list = listRes.body as StatusRow[];
      const first = list[0];
      const res = await request(app.getHttpServer())
        .get(`/author-confirmation-statuses/${first.id}`)
        .expect(200);
      const row = res.body as StatusRow;
      expect(row.id).toBe(first.id);
      expect(row.status).toBe(first.status);
    });
  },
);
