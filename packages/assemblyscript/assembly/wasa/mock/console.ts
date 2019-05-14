import { FileDescriptor } from './fs';

// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
    /**  TODO: Add error checking */
    private static _stdin: FileDescriptor | null = null;
    private static _stdout: FileDescriptor | null = null;
    private static _stderr: FileDescriptor | null = null;

    static get stdin(): FileDescriptor {
        if (Console._stdin == null) {
            // @ts-ignore: Private methods and fields shouldn't matter
            Console._stdin = fs.createFile("/dev/fd/0").result;
        }
        return Console._stdin!;
    }

    static get stdout(): FileDescriptor {
        if (Console._stdout == null) {
            // @ts-ignore: Private methods and fields shouldn't matter
            Console._stdout = fs.createFile("/dev/fd/1").result;
        }
        return Console._stdout!;
    }

    static get stderr(): FileDescriptor {
        if (Console._stderr == null) {
            // @ts-ignore: Private methods and fields shouldn't matter
            Console._stderr = fs.createFile("/dev/fd/2").result;
        }
        return Console._stderr!;
    }

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
