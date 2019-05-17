
//@ts-ignore
@global
export class CommandLine {
    static _args: Array<string> = new Array<string>();

    static push(item: string): void {
        this._args.push(item);
    }

    /**
     * Return all the command-line arguments
     */
    static all(): Array<string> {
        return this._args;
    }

    /**
     * Return the i-th command-ine argument
     * @param i index
     */
    static get(i: usize): string | null {
        let args_len: usize = this._args[0].length;
        if (i < args_len) {
            return this._args[i];
        }
        return null;
    }

    get args(): Array<string> {
        return CommandLine._args;
    }
    /**
     * Deletes arguments
     */
    static reset(): void {
        while (this._args.length > 0) {
            this._args.pop();
        }
    }
}