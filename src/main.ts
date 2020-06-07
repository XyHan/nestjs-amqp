import { NestFactory } from '@nestjs/core';
import { AmqpModule } from './nestjs-amqp/infra/amqp.module';

async function bootstrap() {
  const app = await NestFactory.create(AmqpModule.register({
    config: {
      hostname: 'rabbitmq',
      port: 5672,
      username: 'saphyr',
      password: 'Leaders55',
      vhost: 'saphyr',
    },
    definition: {
      exchanges: [
        { name: 'ex_events', type: 'fanout', options: { durable: true } },
        { name: 'ex_commands', type: 'fanout', options: { durable: true } },
      ],
      queues: [
        { name: 'queue_commands', exchange: 'ex_commands', options: { autoDelete: false, durable: true } },
        { name: 'queue_events', exchange: 'ex_events', options: { autoDelete: false, durable: true } },
      ],
    },
  }));
  await app.listen(3000);
}
bootstrap();
