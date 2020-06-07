import { EnvelopeFactory } from './envelope.factory';
import * as assert from 'assert';
import { AmqpCommand } from '../../application/command/amqp.command';

describe('Envelop Factory', () => {
    it('wrapMessageInEnvelope success', () => {
        const requestId = '45f1fbec-8658-4e56-b60d-ca06a4ebf889';
        const version = 1;
        const name = 'test-command';
        const message = new AmqpCommand(requestId, version, name);
        const envelopeFactory = new EnvelopeFactory();
        const envelope = envelopeFactory.wrapMessageInEnvelope(message);
        assert.equal(requestId, envelope.message.requestId);
        assert.equal(version, envelope.message.version);
        assert.equal(name, envelope.message.name);
        assert.equal(name, envelope.messageType);
    });
});
