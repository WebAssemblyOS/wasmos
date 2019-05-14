import { main as cat } from "../bin/cat";
import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World, testFile } from './fixtures';



// var stdout: fd;

var stdout2: FileDescriptor;

describe("cat", (): void => {
    beforeAll(
        (): void => {
            stdout2 = openStdout();
            testFile().writeString(Hello + " " + World);
        }
    );

    beforeEach((): void => {
        Console.stdout.reset()
        stdout2.reset()
        Console.stdout.erase()
        CommandLine.reset();
        CommandLine.push("cat");
    });

    it("should print newline by default", (): void => {
        CommandLine.push("/test")
        cat(CommandLine.all())
        let str = Hello + " " + World + "\n";
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
        fs.reset(Console.stdout.fd)
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout2.readString().result);
    });

    it("should write to stdout if file not found", () => {
        CommandLine.push("/doesnotexist");
        cat(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    });

})
