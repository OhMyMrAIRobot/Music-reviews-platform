import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupAlbumValuesE2e,
  seedAlbumValuesE2e,
} from './helpers/album-values-e2e.fixture';

interface AlbumValuesListResponseBody {
  meta: { count: number };
  items: unknown[];
}

interface AlbumValueDetailResponseBody {
  totalValue: number;
  release: { id: string; title: string };
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('AlbumValuesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let releaseId: string;
  let authorId: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedAlbumValuesE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
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
    await cleanupAlbumValuesE2e(prisma, releaseId, authorId, [
      regularUserId,
      adminUserId,
    ]);
    await prisma.$disconnect();
  });

  it('GET /album-values returns list shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/album-values')
      .expect(200);
    const body = res.body as AlbumValuesListResponseBody;
    expect(body.meta).toBeDefined();
    expect(body.meta).toHaveProperty('count');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('GET /album-values/:releaseId returns value for release', async () => {
    const res = await request(app.getHttpServer())
      .get(`/album-values/${releaseId}`)
      .expect(200);
    const body = res.body as AlbumValueDetailResponseBody;
    expect(body.release.id).toBe(releaseId);
    expect(typeof body.totalValue).toBe('number');
  });

  it('GET /album-values/:releaseId returns 404 when release missing', () => {
    return request(app.getHttpServer())
      .get('/album-values/cl000000000000000000000001')
      .expect(404);
  });
});
