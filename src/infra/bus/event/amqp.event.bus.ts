import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AmqpEventBusError } from './amqp.event.bus.error';
import { IAmqpEvent } from '../../../application/event/amqp.event';

export interface IAmqpEventBus {
    publish<T extends IAmqpEvent>(event: T): Promise<void>;
}

@Injectable()
export class AmqpEventBus extends Subject<IAmqpEvent> implements IAmqpEventBus {
    constructor() {
        super();
    }

    async publish(event: IAmqpEvent): Promise<void> {
        try {
            this.next(event);
        } catch (e) {
            throw new AmqpEventBusError(e.message);
        }
    }
}
