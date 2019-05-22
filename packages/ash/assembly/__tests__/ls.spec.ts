import { main as ls } from "../bin/ls";
import { stdout, stderr, readString } from './fixtures';


describe("ls", (): void => {

    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("ls");
    });

    it("ls test", (): void => {
        CommandLine.push("home")
        ls(CommandLine.all());
        stdout.reset();
        expect<usize>(Console.stdout.tell()).toBeGreaterThan(0);
        expect<usize>(Console.stdout.tell()).toBe(22);
        expect<string>(stdout.readString().result).toBe("dev test home numbers\n");
    });

    it("ls of a subdirectory test", (): void => {
        ls(CommandLine.all());
        stdout.reset();
        expect<usize>(Console.stdout.tell()).toBeGreaterThan(0);
        expect<usize>(Console.stdout.tell()).toBe(22);
        expect<string>(stdout.readString().result).toBe("dev test home numbers\n");
    });
})
