export class AmqpReflector {
    private static metadata: Map<string, any>;

    static addMetadata(key: string, value: any): void {
        if (this.metadata === undefined) {
            this.metadata = new Map();
        }
        this.metadata.set(key, value);
    }

    static getMetadata(key: string): any {
        return this.metadata.get(key);
    }

    static resetMetadata(): void {
        this.metadata = new Map();
    }
}
