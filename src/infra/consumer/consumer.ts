import { Inject, Injectable } from '@nestjs/common';
import { ConsumerError } from './consumer.error';
import { AmqpReflector} from '../../domain/reflector/amqp.reflector';
import { deserialize, plainToClass } from 'class-transformer';
import { Envelope, IEnvelope } from '../../domain/model/envelope.model';
import { ConsumeMessage } from 'amqplib';
import { IAmqpEvent } from '../../application/event/amqp.event';
import { AmqpAdapter, IAmqp } from '../adapter/amqp.adapter';
import { AmqpEventBus, IAmqpEventBus } from '../bus/event/amqp.event.bus';

export interface IConsumer {
    consume(queue: string): Promise<void>;
}

@Injectable()
export class Consumer implements IConsumer {
    constructor(
        @Inject(AmqpEventBus) private readonly eventBus: IAmqpEventBus,
        @Inject(AmqpAdapter) private readonly amqp: IAmqp,
    ) {}

    public async consume(queue: string): Promise<void> {
        try {
            await this.amqp.consume(queue, (msg: ConsumeMessage) => {
                const event: IAmqpEvent | null = this.getEventFromMessage(msg);
                if (event === null) {
                    this.amqp.reject(msg);
                } else {
                    this.amqp.ack(msg);
                    this.eventBus.publish(event);
                }
            });
        } catch (e) {
            throw new ConsumerError(e.message);
        }
    }

    protected getEventFromMessage(message: ConsumeMessage): IAmqpEvent | null {
        try {
            const envelope: IEnvelope = deserialize(Envelope, message.content.toString());
            const eventName: string = envelope.messageType;

            if (AmqpReflector.getMetadata(eventName) !== undefined) {
                return plainToClass(AmqpReflector.getMetadata(eventName), envelope.message);
            }

            return null;
        } catch (e) {
            throw new ConsumerError(e.message);
        }
    }
}
