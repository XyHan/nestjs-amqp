export interface IAmqpConfig {
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
}

export class AmqpConfig implements IAmqpConfig {
    private _hostname: string;
    private _password: string;
    private _port: number;
    private _username: string;
    private _vhost: string;

    get hostname(): string {
        return this._hostname;
    }

    set hostname(value: string) {
        this._hostname = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get port(): number {
        return this._port;
    }

    set port(value: number) {
        this._port = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get vhost(): string {
        return this._vhost;
    }

    set vhost(value: string) {
        this._vhost = value;
    }
}
