import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { BlogViewDto } from '../../src/modules/bloggers-platform/blogs/api/view-dto/blog.view-dto';
import { createBlog } from './utils/blog.creator';
import { appSetup } from '../../src/setup/app.setup';
import { crearDb } from '../utils/db-clearer';

describe('BlogsController (e2e)', () => {
  let app: INestApplication<App>;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();

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

  it('/blogs (POST) should create blog', async () => {
    const createdBlog = await createBlog(app);
    expect(createdBlog.name).toBe('blog 1');
  });

  it('/blogs:id (GET) should find blog by id', async () => {
    const createdBlog = await createBlog(app);

    const blogId = createdBlog.id;

    const findBlogResponse = await request(app.getHttpServer())
      .get(`/blogs/${blogId}`)
      .expect(200);

    const foundBlog = findBlogResponse.body as BlogViewDto;
    expect(foundBlog.name).toBe('blog 1');
  });

  // it('/orders (GET) should retrieve all orders', async () => {
  //   const response = await request(app.getHttpServer()).get('/orders');
  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);
  //   expect(response.body[0].userId).toBe(createdUserId);
  // });
  //
  // it('/orders/:id (GET) should retrieve an order by id', async () => {
  //   const orderResponse = await request(app.getHttpServer())
  //     .post('/orders')
  //     .send({
  //       orderId: '456',
  //       product: 'Product B',
  //       orderDate: new Date(),
  //       userId: createdUserId,
  //     });
  //
  //   const orderId = orderResponse.body._id;
  //   const response = await request(app.getHttpServer()).get(
  //     `/orders/${orderId}`,
  //   );
  //   expect(response.status).toBe(200);
  //   expect(response.body._id).toBe(orderId);
  //   expect(response.body.userId).toBe(createdUserId);
  // });
  //
  // it('/orders/:id (PATCH) should update an order', async () => {
  //   const orderResponse = await request(app.getHttpServer())
  //     .post('/orders')
  //     .send({
  //       orderId: '789',
  //       product: 'Product C',
  //       orderDate: new Date(),
  //       userId: createdUserId,
  //     });
  //
  //   const orderId = orderResponse.body._id;
  //   const response = await request(app.getHttpServer())
  //     .patch(`/orders/${orderId}`)
  //     .send({ product: 'Updated Product' });
  //
  //   expect(response.status).toBe(200);
  //   expect(response.body.product).toBe('Updated Product');
  // });
  //
  // it('/orders/:id (DELETE) should delete an order', async () => {
  //   const orderResponse = await request(app.getHttpServer())
  //     .post('/orders')
  //     .send({
  //       orderId: '101112',
  //       product: 'Product D',
  //       orderDate: new Date(),
  //       userId: createdUserId,
  //     });
  //
  //   const orderId = orderResponse.body._id;
  //   const response = await request(app.getHttpServer()).delete(
  //     `/orders/${orderId}`,
  //   );
  //   expect(response.status).toBe(200);
  //   expect(response.body._id).toBe(orderId);
  // });
});
