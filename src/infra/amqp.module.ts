import { DynamicModule, Module } from '@nestjs/common';
import { AmqpAdapter } from './adapter/amqp.adapter';
import { Publisher } from './publisher/publisher';
import { Consumer } from './consumer/consumer';
import { AmqpCommandBus } from './bus/command/amqp.command.bus';
import { AmqpEventBus } from './bus/event/amqp.event.bus';
import { envelopeFactory } from './provider/envelope.factory.provider';
import { IAmqpConfig } from '../domain/config/amqp.config';

@Module({
  providers: [
      AmqpAdapter,
      Publisher,
      Consumer,
      AmqpCommandBus,
      AmqpEventBus,
      envelopeFactory,
  ],
  exports: [
      AmqpAdapter,
      Publisher,
      Consumer,
      AmqpCommandBus,
      AmqpEventBus,
  ],
})
export class AmqpModule {
    static register(config: IAmqpConfig): DynamicModule {
        return {
            module: AmqpModule,
            providers: [
                {
                    provide: 'AMQP_CONFIG',
                    useValue: config,
                },
                AmqpAdapter,
            ],
            exports: [AmqpAdapter],
        };
    }
}
