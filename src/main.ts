import { NestFactory } from '@nestjs/core';
import { AmqpModule } from './infra/amqp.module';

async function bootstrap() {
  const app = await NestFactory.create(AmqpModule.register({
    hostname: '',
    port: 5601,
    username: '',
    password: '',
    vhost: '',
  }));
  await app.listen(3000);
}
bootstrap();
