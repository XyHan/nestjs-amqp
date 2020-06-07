import * as assert from 'assert';
import { AmqpCommand } from './amqp.command';

describe('Amqp Command', () => {
    it('Set new Amqp Command success', () => {
        const requestId = '45f1fbec-8658-4e56-b60d-ca06a4ebf889';
        const version = 1;
        const name = 'test-command';
        const message = new AmqpCommand(requestId, version, name);
        assert.equal(requestId, message.requestId);
        assert.equal(version, message.version);
        assert.equal(name, message.name);
    });
});
