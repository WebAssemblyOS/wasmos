import { main as mkdir } from "../bin/mkdir";

import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World, testFile } from './mocks';

describe("mkdir", (): void => {

    beforeEach((): void => {
        Console.stderr.reset()
        Console.stderr.erase()
        CommandLine.reset();
        CommandLine.push("mkdir");
    })

    it("simple top level direcotry has no error", (): void => {
        CommandLine.push("/test")
        mkdir(CommandLine.all())
        expect<u32>(Console.stderr.offset).toBe(0);
    })

    it("if the parent directory does not exists it should be failed", (): void => {
        CommandLine.push("/foo/test")
        mkdir(CommandLine
          .all())
        expect<u32>(Console.stderr.offset).not.toBe(0);
    })
})
