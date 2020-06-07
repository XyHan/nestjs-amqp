export interface IAmqpCommand {
    requestId: string;
    version: number;
    name: string;
}

export class AmqpCommand implements IAmqpCommand {
    constructor(
        protected _requestId: string,
        protected _version: number,
        protected _name: string,
    ) {}

    get requestId(): string {
        return this._requestId;
    }

    get name(): string {
        return this._name;
    }

    get version(): number {
        return this._version;
    }
}
