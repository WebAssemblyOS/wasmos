import { FileDescriptor } from './fs';

// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
    /**  TODO: Add error checking */
    static stdin: FileDescriptor = new FileDescriptor(0, null)
    static stdout: FileDescriptor = new FileDescriptor(1, null)
    static stderr: FileDescriptor = new FileDescriptor(2, null)


    /**
     * Write a string to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    static write(s: string, newline: boolean = false): void {
        this.stdout.writeString(s, newline);
    }

    /**
     * Read an UTF8 string from the console, convert it to a native string
     */
    static readAll(): string | null {
        let res = this.stdin.readString();
        if (res.failed) {
            return null;
        }
        return res.result;
    }

    /**
     * Alias for `Console.write()`
     */
    static log(s: string): void {
        this.write(s, true);
    }

    /**
     * Write an error to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    static error(s: string, newline: boolean = true): void {
        this.stderr.writeString(s, newline);
    }
}
