import {main as touch} from "../bin/touch"
import { main as cat } from "../bin/cat";
import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World, testFile } from './mocks';

var stdout: FileDescriptor

describe("touch", (): void => {
    beforeAll(
        (): void => {
            stdout = openStdout();
            var tempFile = fs.openForRead("/temp_cat_test_file").result.fd;
            fs.erase(tempFile);
        });

        beforeEach((): void => {
            Console.stdout.reset();
            stdout.reset();
            Console.stdout.erase()
            CommandLine.reset();
            CommandLine.push("touch");
        });
    
        it("should create a file that does not exist", (): void => {
            CommandLine.push("/temp_cat_test_file");
            touch(CommandLine.all());
            Console.stdout.reset()
            CommandLine.reset();
            CommandLine.push("cat");
            CommandLine.push("/temp_cat_test_file");
            cat(CommandLine.all());
            expect<String>(Console.stdout.readString()).toBe("")
        });        
})