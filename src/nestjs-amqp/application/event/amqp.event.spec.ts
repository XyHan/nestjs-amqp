import * as assert from 'assert';
import { AmqpEvent } from './amqp.event';

describe('Amqp Event', () => {
    it('Set new Amqp Event success', () => {
        const requestId = '45f1fbec-8658-4e56-b60d-ca06a4ebf889';
        const version = 1;
        const name = 'test-event';
        const message = new AmqpEvent(requestId, version, name);
        assert.equal(requestId, message.requestId);
        assert.equal(version, message.version);
        assert.equal(name, message.name);
    });
});
