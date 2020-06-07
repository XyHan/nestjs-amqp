export class AmqpCommandBusError extends Error {
    constructor(message: string) {
        super(message);
    }
}
