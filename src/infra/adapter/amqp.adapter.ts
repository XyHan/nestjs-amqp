import { Connection, connect, Channel, ConsumeMessage } from 'amqplib';
import { Inject, Injectable } from '@nestjs/common';
import { Message, Options } from 'amqplib/properties';
import { IAmqpConfig } from '../../domain/config/amqp.config';
import { AmqpAdapterError } from './amqp.adapter.error';

const ORIGAMI_EX_EVENT_BUS: string = 'ex_origami_events';
const ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT: string = 'origami_gw_bo_people_js_event';
const ORIGAMI_EX_COMMAND_BUS: string = 'ex_origami_commands';
const ORIGAMI_QUEUE_PEOPLE_COMMANDS: string = 'origami_people_commands';
const ORIGAMI_QUEUE_EVENT_COMMANDS: string = 'origami_event_commands';

export interface IAmqp {
    connect(): Promise<void>;
    consume(queue: string, callback: (msg: ConsumeMessage) => void): Promise<void>;
    publish(exchange: string, routingKey: string, message: Buffer, options?: Options.Publish): Promise<void>;
    closeConnection(): Promise<void>;
    closeChannel(): Promise<void>;
    ack(message: Message): Promise<void>;
    reject(message: Message): Promise<void>;
}

@Injectable()
export class AmqpAdapter implements IAmqp {
    private connection: Connection;
    private channel: Channel;

    constructor(
        @Inject('AMQP_CONFIG') private readonly configService: IAmqpConfig,
    ) {}

    async connect(): Promise<void> {
        try {
            if (this.connection === undefined || this.channel === undefined) {
                this.connection = await connect(this.configService);
                this.channel = await this.connection.createChannel();
                await this.assertQueue(ORIGAMI_QUEUE_PEOPLE_COMMANDS, { autoDelete: false, durable: true });
                await this.assertQueue(ORIGAMI_QUEUE_EVENT_COMMANDS, { autoDelete: false, durable: true });
                await this.bindQueue(ORIGAMI_QUEUE_PEOPLE_COMMANDS, ORIGAMI_EX_COMMAND_BUS, '');
                await this.bindQueue(ORIGAMI_QUEUE_EVENT_COMMANDS, ORIGAMI_EX_COMMAND_BUS, '');
                await this.assertExchange(ORIGAMI_EX_EVENT_BUS, 'fanout', {durable: true});
                await this.assertQueue(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT, {durable: true});
                await this.bindQueue(ORIGAMI_QUEUE_GW_BO_PEOPLE_JS_EVENT, ORIGAMI_EX_EVENT_BUS, '');
            }
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async bindQueue(queue: string, exchange: string, pattern: string, args?: any): Promise<void> {
        try {
            await this.channel.bindQueue(queue, exchange, pattern, args);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async assertQueue(queue: string, options?: Options.AssertQueue): Promise<void> {
        try {
            await this.channel.assertQueue(queue, options);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async assertExchange(exchange: string, type: string, options?: Options.AssertExchange): Promise<void> {
        try {
            await this.channel.assertExchange(exchange, type, options);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async consume(queue: string, callback: (msg: ConsumeMessage) => void): Promise<void> {
        try {
            await this.channel.consume(queue, callback);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async publish(exchange: string, routingKey: string, message: Buffer, options?: Options.Publish): Promise<void> {
        try {
            await this.channel.publish(exchange, routingKey, message);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async reject(message: Message): Promise<void> {
        try {
            await this.channel.reject(message, false);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async ack(message: Message): Promise<void>  {
        try {
            await this.channel.ack(message, false);
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async closeConnection(): Promise<void> {
        try {
            return this.connection.close();
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }

    async closeChannel(): Promise<void> {
        try {
            return this.channel.close();
        } catch (e) {
            throw new AmqpAdapterError(e.message);
        }
    }
}
