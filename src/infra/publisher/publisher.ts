import { IAmqpCommand } from '../../application/command/amqp.command';
import { EnvelopeFactory, IEnvelopeFactory } from '../../domain/factory/envelope.factory';
import { PublisherError } from './publisher.error';
import { Inject, Injectable } from '@nestjs/common';
import { AmqpAdapter, IAmqp } from '../adapter/amqp.adapter';
import { serialize } from 'class-transformer';

export interface IPublisher {
    publish(exchange: string, routingKey: string, command: IAmqpCommand): Promise<void>;
}

@Injectable()
export class Publisher implements IPublisher {
    constructor(
        @Inject(EnvelopeFactory) private readonly envelopeFactory: IEnvelopeFactory,
        @Inject(AmqpAdapter) private readonly amqp: IAmqp,
    ) {}

    public async publish(exchange: string, routingKey: string, command: IAmqpCommand): Promise<void> {
        try {
            const message: Buffer = await this.commandToMessage(command);
            await this.sendMessage(exchange, routingKey, message);
        } catch (e) {
            throw new PublisherError(e.message);
        }
    }

    private async commandToMessage(command: IAmqpCommand): Promise<Buffer> {
        const envelope = this.envelopeFactory.wrapMessageInEnvelope(command);
        return Buffer.from(serialize(envelope));
    }

    private async sendMessage(exchange: string, routingKey: string, message: Buffer): Promise<void> {
        await this.amqp.publish(exchange, routingKey, message);
    }
}
