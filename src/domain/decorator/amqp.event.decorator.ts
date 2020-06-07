import { IAmqpEvent } from '../../application/event/amqp.event';

export function amqpEvent(eventAdapter: IAmqpEvent): any {
    return function init(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        return target;
    };
}
