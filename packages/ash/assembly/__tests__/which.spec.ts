
import { Environ, Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World } from './mocks';
import { main as echo } from "../bin/echo";

type fd = usize;


let env: Environ;
var stdout2: FileDescriptor;
// let stdout = Console.stdout;


describe("echo", (): void => {
    beforeAll(
        (): void => {
            stdout2 = openStdout();
            env = new Environ();
            env.add("$PATH", "/test")
        }
    );

    beforeEach((): void => {
        Console.stdout.reset();
        Console.stdout.erase();
        fs.openForWrite("/test/foo");
        CommandLine.reset();
        CommandLine.push("which");
    })

    it("should find a file in my path", (): void => {
        CommandLine.push("foo")
        echo(CommandLine.all())
        Console.stdout.reset();
        expect<string>(Console.stdout.readString()).toBe("/test/foo")
    })
})

