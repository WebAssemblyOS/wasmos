import { main as cat } from "../bin/cat";

import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World, testFile } from './mocks';




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
    })

    it("should print newline by default", (): void => {
        CommandLine.push("/test")
        cat(CommandLine.all())
        let str = Hello + " " + World + "\n";
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString()).toBe(Hello + " " + World + "\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString()).toBe(stdout2.readString());
    })

})
