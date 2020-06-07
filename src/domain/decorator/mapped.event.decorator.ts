import { AmqpReflector } from '../reflector/amqp.reflector';
import { IAmqpEvent } from '../../application/event/amqp.event';

export function mappedEvent(eventName: string): any {
    return function mapEvent(target: IAmqpEvent): IAmqpEvent {
        AmqpReflector.addMetadata(eventName, target);
        return target;
    };
}
