import * as assert from 'assert';
import { AmqpEventBus } from '../bus/event/amqp.event.bus';
import { IAmqp } from '../adapter/amqp.adapter';
import { Message } from 'amqplib';
import { serialize } from 'class-transformer';
import { AmqpEvent, IAmqpEvent } from '../../application/event/amqp.event';
import { AmqpReflector } from '../../domain/reflector/amqp.reflector';
import { Consumer } from './consumer';
import { EnvelopeFactory } from '../../domain/factory/envelope.factory';

describe('Consumer', () => {
    const requestId = '84d03f45-7511-4cc5-b034-c686829abd29';
    const eventBus: AmqpEventBus = undefined;
    const amqpAdapter: IAmqp = undefined;
    const amqpMessage: Message = {
        fields: {
            consumerTag: 'amq.ctag-2-3M3OPFpjAyghQaZkIJxA',
            deliveryTag: 1,
            redelivered: false,
            exchange: '',
            routingKey: 'origami_gw_bo_people_js_event',
        },
        properties: {
            headers: {},
            deliveryMode: 1,
            contentType: undefined,
            contentEncoding: undefined,
            priority: undefined,
            correlationId: undefined,
            replyTo: undefined,
            expiration: undefined,
            messageId: undefined,
            timestamp: undefined,
            type: undefined,
            userId: undefined,
            appId: undefined,
            clusterId: undefined,
        },
        content: Buffer.from(serialize(new EnvelopeFactory().wrapMessageInEnvelope(new AmqpEvent(requestId, 1, 'AmqpEvent')))),
    };

    it('getEventFromMessage success', () => {
        AmqpReflector.resetMetadata();
        AmqpReflector.addMetadata('AmqpEvent', AmqpEvent);
        const consumer = new Consumer(eventBus, amqpAdapter);
        const consumerProto = Object.getPrototypeOf(consumer);
        const event: IAmqpEvent | null = consumerProto.getEventFromMessage(amqpMessage);

        assert.equal(event.version, 1);
        assert.equal(event.requestId, requestId);
        assert.equal(event.name, 'AmqpEvent');
    });

    it('getEventFromMessage failed', () => {
        AmqpReflector.resetMetadata();
        AmqpReflector.addMetadata('toto', AmqpEvent);
        const consumer = new Consumer(eventBus, amqpAdapter);
        const consumerProto = Object.getPrototypeOf(consumer);
        const event: IAmqpEvent | null = consumerProto.getEventFromMessage(amqpMessage);
        assert.equal(event, null);
    });
});
