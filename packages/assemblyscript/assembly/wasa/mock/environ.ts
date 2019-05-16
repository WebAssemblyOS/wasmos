

class EnvironEntry {
    constructor(readonly key: string, readonly value: string) { }
}

//@ts-ignore
@global
export class Environ {
    static env: Array<EnvironEntry> = new Array<EnvironEntry>();

    static add(key: string, value: string): void {
        this.env.push(new EnvironEntry(key, value));
    }

    /**
     *  Return all environment variables
     */
    static all(): Array<EnvironEntry> {
        return this.env;
    }

    /**
     * Return the value for an environment variable
     * @param key environment variable name
     */
    static get(key: string): string {
        for (let i = 0, j = this.env.length; i < j; i++) {
            if (this.env[i].key == key) {
                return this.env[i].value;
            }
        }
        return "";
    }

    static reset(): void {
        while (this.env.length > 0) {
            this.env.pop();
        }
    }
}