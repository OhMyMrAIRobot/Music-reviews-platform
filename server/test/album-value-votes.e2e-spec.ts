import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import {
  cleanupAlbumValueVotesE2e,
  seedAlbumValueVotesE2e,
} from './helpers/album-value-votes-e2e.fixture';

interface LoginResponseBody {
  accessToken: string;
}

interface VoteResponseBody {
  id: string;
  releaseId: string;
  userId: string;
}

const runE2e = !!process.env.DATABASE_URL;

(runE2e ? describe : describe.skip)('AlbumValueVotesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaClient;
  let regularUserId: string;
  let adminUserId: string;
  let regularEmail: string;
  let adminEmail: string;
  let releaseId: string;
  let authorId: string;
  let voteId: string;

  function validCreateBody(rid: string) {
    return {
      releaseId: rid,
      rarityGenre: 0.5,
      rarityPerformance: 1.5,
      formatReleaseScore: 1,
      integrityGenre: 2.5,
      integritySemantic: 0.5,
      depthScore: 3,
      qualityRhymesImages: 5,
      qualityStructureRhythm: 5,
      qualityStyleImpl: 5,
      qualityIndividuality: 5,
      influenceAuthorPopularity: 1.5,
      influenceReleaseAnticip: 2.5,
    };
  }

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET || 'e2e-jwt-access-secret';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'e2e-jwt-refresh-secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';

    prisma = new PrismaClient();
    const fixture = await seedAlbumValueVotesE2e(prisma);
    regularUserId = fixture.regular.id;
    adminUserId = fixture.admin.id;
    regularEmail = fixture.regular.email;
    adminEmail = fixture.admin.email;
    releaseId = fixture.release.id;
    authorId = fixture.author.id;
    voteId = '';

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
    await cleanupAlbumValueVotesE2e(prisma, releaseId, authorId, [
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

  it('POST /album-value-votes without auth returns 401', () => {
    return request(app.getHttpServer())
      .post('/album-value-votes')
      .send(validCreateBody(releaseId))
      .expect(401);
  });

  it('POST /album-value-votes as user creates vote', async () => {
    const token = await login(regularEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .post('/album-value-votes')
      .set('Authorization', `Bearer ${token}`)
      .send(validCreateBody(releaseId))
      .expect(201);
    const body = res.body as VoteResponseBody;
    expect(body.releaseId).toBe(releaseId);
    expect(body.userId).toBe(regularUserId);
    voteId = body.id;
  });

  it('GET /album-value-votes/release/:releaseId returns vote', async () => {
    const token = await login(regularEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .get(`/album-value-votes/release/${releaseId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect((res.body as VoteResponseBody).id).toBe(voteId);
  });

  it('POST /album-value-votes returns 400 when duplicate', async () => {
    const token = await login(regularEmail, 'testpass123');
    return request(app.getHttpServer())
      .post('/album-value-votes')
      .set('Authorization', `Bearer ${token}`)
      .send(validCreateBody(releaseId))
      .expect(400);
  });

  it('PATCH /album-value-votes/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, 'testpass123');
    return request(app.getHttpServer())
      .patch(`/album-value-votes/${voteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ depthScore: 4 })
      .expect(403);
  });

  it('PATCH /album-value-votes/:id as owner updates vote', async () => {
    const token = await login(regularEmail, 'testpass123');
    const res = await request(app.getHttpServer())
      .patch(`/album-value-votes/${voteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ depthScore: 4 })
      .expect(200);
    expect((res.body as VoteResponseBody).id).toBe(voteId);
    expect((res.body as VoteResponseBody).userId).toBe(regularUserId);
  });

  it('DELETE /album-value-votes/:id returns 403 for non-owner', async () => {
    const token = await login(adminEmail, 'testpass123');
    return request(app.getHttpServer())
      .delete(`/album-value-votes/${voteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('DELETE /album-value-votes/:id as owner removes vote', async () => {
    const token = await login(regularEmail, 'testpass123');
    await request(app.getHttpServer())
      .delete(`/album-value-votes/${voteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    voteId = '';
  });
});
