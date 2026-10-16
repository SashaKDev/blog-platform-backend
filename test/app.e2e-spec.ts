import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();
  });

  it('/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect('Hello World!');
  });

  // it('create blog ', () => {
  //   return request(app.getHttpServer())
  //     .post('/api/blogs')
  //     .send({
  //       name: 'blog 1',
  //       description: 'blog 1123455',
  //       websiteUrl: 'doiki.com',
  //     })
  //     .expect(204);
  // });

  afterEach(async () => {
    await app.close();
  });
});
