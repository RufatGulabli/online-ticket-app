import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './Interceptors/ResponseInterceptor';
import { GlobalExceptionFilter } from './Exceptions/GlobalExceptionFilter';
import { CrudConfigService } from '@nestjsx/crud';
// This should be configured before import of AppModule due to TS Decorators
CrudConfigService.load({
  query: {
    limit: 10,
    cache: 100,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
});

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tickets World')
    .setDescription('The Tickets World API description')
    .setVersion('1.0')
    .addTag('Tickets World')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.APP_PORT);
}
bootstrap();
