import * as assert from 'assert';
import { EnvelopeFactory } from '../../domain/factory/envelope.factory';
import { Publisher } from './publisher';
import { AmqpCommand } from '../../application/command/amqp.command';
import { PublisherError } from './publisher.error';
import {IAmqp} from '../adapter/amqp.adapter';

describe('Publisher', () => {
    const requestId = '84d03f45-7511-4cc5-b034-c686829abd29';

    it('publish success', async () => {
        const amqpMock: IAmqp = {
            ack: jest.fn(),
            closeChannel: jest.fn(),
            closeConnection: jest.fn(),
            connect: jest.fn(),
            consume: jest.fn(),
            reject: jest.fn(),
            publish: jest.fn((exchange: string, routingKey: string, message: Buffer) => {
                return Promise.resolve();
            }),
        };
        let isError = false;
        try {
            const publisher = new Publisher(new EnvelopeFactory(), amqpMock);
            await publisher.publish('exchange', '', new AmqpCommand(requestId, 1, 'test-publisher-command'));
        } catch (e) {
            isError = true;
        }

        assert.strictEqual(isError, false);
    });

    it('publish failed', async () => {
        const amqpMock: IAmqp = {
            ack: jest.fn(),
            closeChannel: jest.fn(),
            closeConnection: jest.fn(),
            connect: jest.fn(),
            consume: jest.fn(),
            reject: jest.fn(),
            publish: jest.fn((exchange: string, routingKey: string, message: Buffer) => {
                return Promise.reject(new PublisherError('Publisher error'));
            }),
        };

        try {
            const publisher = new Publisher(new EnvelopeFactory(), amqpMock);
            await publisher.publish('exchange', '', new AmqpCommand(requestId, 1, 'test-publisher-command'));
        } catch (e) {
            assert.strictEqual('Publisher error', e.message);
        }
    });
});
