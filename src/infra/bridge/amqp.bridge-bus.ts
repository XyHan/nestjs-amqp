import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IPublisher, Publisher } from '../publisher/publisher';
import { Consumer, IConsumer } from '../consumer/consumer';
import { AmqpCommandBus } from '../bus/command/amqp.command.bus';
import { IAmqpCommand } from '../../application/command/amqp.command';
import { AmqpBridgeBusError } from './amqp.bridge-bus.error';
import { AmqpAdapter, IAmqp } from '../adapter/amqp.adapter';

const ORIGAMI_EX_EVENT_BUS: string = 'ex_origami_events';
const ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT: string = 'origami_gw_bo_people_js_event';
const ORIGAMI_EX_COMMAND_BUS: string = 'ex_origami_commands';
const ORIGAMI_QUEUE_PEOPLE_COMMANDS: string = 'origami_people_commands';
const ORIGAMI_QUEUE_EVENT_COMMANDS: string = 'origami_event_commands';

@Injectable()
export class BridgeBusRabbitMq implements OnModuleInit {
    constructor(
        @Inject(AmqpAdapter) private readonly amqp: IAmqp,
        @Inject(Publisher) private readonly publisher: IPublisher,
        @Inject(Consumer) private readonly consumer: IConsumer,
        @Inject(AmqpCommandBus) private readonly commandBus: AmqpCommandBus,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.setUpBus();
        await this.bridgeCommandBus();
        await this.bridgeEventBus();
    }

    private async setUpBus(): Promise<void> {
        await this.amqp.connect();
        await this.amqp.assertExchange(ORIGAMI_EX_COMMAND_BUS, 'fanout', {durable: true});
        await this.amqp.assertExchange(ORIGAMI_EX_EVENT_BUS, 'fanout', {durable: true});
        await this.amqp.assertQueue(ORIGAMI_QUEUE_PEOPLE_COMMANDS, { autoDelete: false, durable: true });
        await this.amqp.assertQueue(ORIGAMI_QUEUE_EVENT_COMMANDS, { autoDelete: false, durable: true });
        await this.amqp.assertQueue(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT, {durable: true});
        await this.amqp.bindQueue(ORIGAMI_QUEUE_PEOPLE_COMMANDS, ORIGAMI_EX_COMMAND_BUS, '');
        await this.amqp.bindQueue(ORIGAMI_QUEUE_EVENT_COMMANDS, ORIGAMI_EX_COMMAND_BUS, '');
        await this.amqp.bindQueue(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT, ORIGAMI_EX_EVENT_BUS, '');
    }

    private async bridgeCommandBus(): Promise<void> {
        await this.commandBus.subscribe(
            (command: IAmqpCommand) => this.publisher.publish(ORIGAMI_EX_COMMAND_BUS, '', command),
            (error) => { throw new AmqpBridgeBusError(error.message); },
        );
    }

    private async bridgeEventBus(): Promise<void> {
        await this.consumer.consume(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT);
    }
}
