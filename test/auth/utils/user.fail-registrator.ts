import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const registerUserFailure = async (
  app: INestApplication,
): Promise<void> => {
  await request(app.getHttpServer())
    .post('/auth/registration')
    .send({
      login: 'user 1',
      password: '1234567',
      email: 'user1@gmail.com',
    })
    .expect(400);
};
