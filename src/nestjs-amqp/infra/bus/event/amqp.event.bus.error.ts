export class AmqpEventBusError extends Error {
    constructor(message: string) {
        super(message);
    }
}
