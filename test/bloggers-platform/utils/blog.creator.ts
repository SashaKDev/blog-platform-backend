import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Response } from 'supertest';
import { BlogViewDto } from '../../../src/modules/bloggers-platform/blogs/api/view-dto/blog.view-dto';
import { CoreConfig } from '../../../src/modules/config/core.config';

export const createBlog = async (
  app: INestApplication,
): Promise<BlogViewDto> => {
  const coreConfig = app.get(CoreConfig);

  const login = coreConfig.basicLogin;
  const password = coreConfig.basicPassword;
  const credentials = Buffer.from(`${login}:${password}`).toString('base64');

  const response = await request(app.getHttpServer())
    .post('/blogs')
    .send({
      name: 'blog 1',
      description: 'blog 1 description',
      websiteUrl: 'blog1.com',
    })
    .set('Authorization', `Basic ${credentials}`)
    .expect(201);

  return response.body as BlogViewDto;
};
