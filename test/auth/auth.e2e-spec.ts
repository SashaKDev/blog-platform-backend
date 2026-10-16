import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';
import { registerUserSuccessfully } from './utils/user.success-registrator';
import { EmailService } from '../../src/modules/notification/infrastructure/email.service';
import { MockEmailService } from '../mocks/mock-email.service';
import request from 'supertest';
import { crearDb } from '../utils/db-clearer';
import { CoreConfig } from '../../src/modules/config/core.config';
import { registerUserFailure } from './utils/user.fail-registrator';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let connection: Connection;
  let coreConfig: CoreConfig;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useClass(MockEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();

    coreConfig = app.get(CoreConfig);

    // Получаем подключение к базе данных
    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  beforeEach(async () => {
    if (!connection.db) {
      throw new Error('No connection db found.');
    }
    await crearDb(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/registration (POST) should successfully register user', async () => {
    await registerUserSuccessfully(app);
  });

  it('/auth/registration (POST) should try to register user with existing email', async () => {
    await registerUserSuccessfully(app);
    await registerUserFailure(app);
  });

  it('/auth/registration (POST) should try register user too fast ', async () => {
    await registerUserSuccessfully(app);
    await registerUserFailure(app);
    await registerUserFailure(app);
    await registerUserFailure(app);
    await registerUserFailure(app);
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: 'user 1',
        password: '1234567',
        email: 'user1@gmail.com',
      })
      .expect(429);
  });

  it('/users (GET) should list all users', async () => {
    const credentials = Buffer.from(
      `${coreConfig.basicLogin}:${coreConfig.basicPassword}`,
    ).toString('base64');

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Basic ${credentials}`)
      .expect(200);
  });

  it('/auth/login (POST) should login user and return access token', async () => {
    await registerUserSuccessfully(app);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'user1@gmail.com', password: '1234567' })
      .expect(200);

    const loginResponseBody = loginResponse.body as { accessToken: string };

    expect(loginResponseBody).toHaveProperty('accessToken');
    expect(typeof loginResponseBody.accessToken).toBe('string');
  });
});
