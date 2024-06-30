import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'fs';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.enableCors();

  // Load your OpenAPI YAML file
  const document = fs.readFileSync(
    join(__dirname, '../docs/inventory.json'),
    'utf8',
  );

  // Serve Swagger UI
  app.use('/api', swaggerUi.serve, swaggerUi.setup(JSON.parse(document)));

  await app.listen(3000);
}
bootstrap();
