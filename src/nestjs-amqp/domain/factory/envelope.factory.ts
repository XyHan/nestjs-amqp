import { IAmqpCommand } from '../../application/command/amqp.command';
import { IEnvelope, Envelope } from '../model/envelope.model';
import { IAmqpEvent } from '../../application/event/amqp.event';

export interface IEnvelopeFactory {
    wrapMessageInEnvelope(message: IAmqpCommand | IAmqpEvent): IEnvelope;
}

export class EnvelopeFactory implements IEnvelopeFactory {
    wrapMessageInEnvelope(message: IAmqpCommand | IAmqpEvent): IEnvelope {
        return new Envelope(message);
    }
}
