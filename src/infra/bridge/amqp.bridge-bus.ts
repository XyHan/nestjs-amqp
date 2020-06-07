import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IPublisher, Publisher } from '../publisher/publisher';
import { Consumer, IConsumer } from '../consumer/consumer';
import { AmqpCommandBus } from '../bus/command/amqp.command.bus';
import { IAmqpCommand } from '../../application/command/amqp.command';
import { AmqpBridgeBusError } from './amqp.bridge-bus.error';
import { AmqpAdapter, IAmqp } from '../adapter/amqp.adapter';

const ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT: string = 'origami_gw_bo_people_js_event';
const ORIGAMI_EX_COMMAND_BUS: string = 'ex_origami_commands';

@Injectable()
export class BridgeBusRabbitMq implements OnModuleInit {
    constructor(
        @Inject(AmqpAdapter) private readonly amqp: IAmqp,
        @Inject(Publisher) private readonly publisher: IPublisher,
        @Inject(Consumer) private readonly consumer: IConsumer,
        @Inject(AmqpCommandBus) private readonly commandBus: AmqpCommandBus,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.bridgeCommandBus();
        await this.bridgeEventBus();
    }

    private async bridgeCommandBus(): Promise<void> {
        await this.amqp.connect();
        await this.commandBus.subscribe(
            (command: IAmqpCommand) => this.publisher.publish(ORIGAMI_EX_COMMAND_BUS, '', command),
            (error) => { throw new AmqpBridgeBusError(error.message); },
        );
    }

    private async bridgeEventBus(): Promise<void> {
        await this.consumer.consume(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT);
    }
}
