export interface IAmqpEvent {
    version: number;
    name: string;
    requestId: string;
}

export class AmqpEvent implements IAmqpEvent {
    constructor(
        protected _requestId: string,
        protected _version: number,
        protected _name: string,
    ) {}

    get requestId(): string {
        return this._requestId;
    }

    get version(): number {
        return this._version;
    }

    get name(): string {
        return this._name;
    }
}
