import * as assert from 'assert';
import { AmqpReflector } from './amqp.reflector';

describe('AmqpReflector', () => {
    it('addMetadata success', () => {
        const key = 'myKey';
        const value = '4474992d-f4f0-4467-a458-6a43b837094b';
        AmqpReflector.addMetadata(key, value);
        assert.equal(value, AmqpReflector.getMetadata(key));
    });

    it('addMetadata failed', () => {
        assert.equal(undefined, AmqpReflector.getMetadata('4474992d-f4f0-4467-a458-6a43b837094b'));
    });
});
