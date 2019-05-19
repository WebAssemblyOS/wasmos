import { FileDescriptor } from './fs/fs';

// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
    /**  TODO: Add error checking */
    constructor(public stdin: FileDescriptor,
        public stdout: FileDescriptor,
        public stderr: FileDescriptor) { };

    static init(): Console {
        let stdin: FileDescriptor = new FileDescriptor(0, null);
        let stdout: FileDescriptor = new FileDescriptor(1, null);
        let stderr: FileDescriptor = new FileDescriptor(2, null);
        return new Console(stdin, stdout, stderr)
    }


    /**
     * Write a string to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    write(s: string, newline: boolean = false): void {
        this.stdout.writeString(s, newline);
    }

    /**
     * Read an UTF8 string from the console, convert it to a native string
     */
    readAll(): string | null {
        let res = this.stdin.readString();
        if (res.failed) {
            return null;
        }
        return res.result;
    }

    /**
     * Alias for `Console.write()`
     */
    log(s: string): void {
        this.write(s, true);
    }

    /**
     * Write an error to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    error(s: string, newline: boolean = true): void {
        this.stderr.writeString(s, newline);
    }
}
