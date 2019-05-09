// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
    /**  TODO: Add error checking */
    private static _stdin: FileDescriptor | null = null;
    private static _stdout: FileDescriptor | null = null;
    private static _stderr: FileDescriptor | null = null;

    static get stdin(): FileDescriptor {
        if (Console._stdin == null) {
            Console._stdin = fs.openForRead("/dev/fd/0").result;
        }
        return Console._stdin!;
    }

    static get stdout(): FileDescriptor {
        if (Console._stdout == null) {
            Console._stdout = fs.openForWrite("/dev/fd/1").result;
        }
        return Console._stdout!;
    }

    static get stderr(): FileDescriptor {
        if (Console._stderr == null) {
            Console._stderr = fs.openForRead("/dev/fd/2").result;
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
        return this.stdin.readString();
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
