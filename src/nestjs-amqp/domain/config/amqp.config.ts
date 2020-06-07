export interface IAmqpConfig {
    config: IConnection;
    definition: IDefinition;
}

export interface IConnection {
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
}

export interface IDefinition {
    exchanges: IExchange[];
    queues: IQueue[];
}

export interface IExchange {
    name: string;
    type: string;
    options: object;
}

export interface IQueue {
    name: string;
    exchange: string;
    options: object;
}
