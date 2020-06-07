import { IAmqpCommand } from '../../application/command/amqp.command';
import { IAmqpEvent } from '../../application/event/amqp.event';

export interface IEnvelope {
    messageType: string;
    message: IAmqpCommand | IAmqpEvent;
}

export class Envelope implements IEnvelope {
    protected _messageType: string;
    protected _message: IAmqpCommand | IAmqpEvent;

    constructor(message?: IAmqpCommand | IAmqpEvent) {
        if (message) {
            this.wrap(message);
        }
    }

    get messageType(): string {
        return this._messageType;
    }

    set messageType(value: string) {
        this._messageType = value;
    }

    get message(): IAmqpCommand | IAmqpEvent {
        return this._message;
    }

    set message(value: IAmqpCommand | IAmqpEvent) {
        this._message = value;
    }

    private wrap(message: IAmqpCommand | IAmqpEvent): void {
        this.messageType = message.name;
        this.message = message;
    }
}
