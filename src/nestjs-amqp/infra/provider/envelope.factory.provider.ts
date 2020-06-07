import { EnvelopeFactory } from '../../domain/factory/envelope.factory';

export const envelopeFactory = {
    provide: EnvelopeFactory,
    useClass: EnvelopeFactory,
};
