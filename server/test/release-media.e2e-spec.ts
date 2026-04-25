import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';

interface MediaListBody {
  meta: { count: number };
  items: Array<{ id: string }>;
}

interface MediaDetailBody {
  id: string;
  title: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('ReleaseMediaController (e2e)', () => {
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

  it('GET /release-media returns list shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/release-media')
      .expect(200);
    const body = res.body as MediaListBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /release-media/:id returns 404 for missing id', () => {
    return request(app.getHttpServer())
      .get('/release-media/cl000000000000000000000001')
      .expect(404);
  });

  it('GET /release-media/:id returns media when first exists', async () => {
    const listRes = await request(app.getHttpServer())
      .get('/release-media')
      .expect(200);
    const list = listRes.body as MediaListBody;
    if (list.items.length === 0) {
      return;
    }
    const res = await request(app.getHttpServer())
      .get(`/release-media/${list.items[0].id}`)
      .expect(200);
    const row = res.body as MediaDetailBody;
    expect(row.id).toBe(list.items[0].id);
    expect(row.title).toBeDefined();
  });
});
