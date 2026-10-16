import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const crearDb = async (app: INestApplication): Promise<void> => {
  await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
};
