import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AmqpCommandBusError } from './amqp.command.bus.error';
import { IAmqpCommand } from '../../../application/command/amqp.command';

export interface IAmqpCommandBus {
    execute<T extends IAmqpCommand>(command: IAmqpCommand): Promise<void>;
}

@Injectable()
export class AmqpCommandBus extends Subject<IAmqpCommand> implements IAmqpCommandBus {
    constructor() {
        super();
    }

    async execute(command: IAmqpCommand): Promise<void> {
        try {
            this.next(command);
        } catch (e) {
            throw new AmqpCommandBusError(e.message);
        }
    }
}
