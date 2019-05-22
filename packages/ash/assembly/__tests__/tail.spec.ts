import { main as tail } from "../bin/tail";
import { stdout, Hello, World, Hello_World, stderr, createFile } from './fixtures';
import { } from './helper';

describe("cat", (): void => {

    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("tail");
    });

    it("should print newline by default", (): void => {
        CommandLine.push("/test")
        tail(CommandLine.all())
        let str = Hello_World + "\n";
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "String doesn't have a terminating NUL")
        fs.reset(Console.stdout.fd)
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    });

    it("should write to stderr if file not found", () => {
        CommandLine.push("/doesnotexist");
        tail(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("tail: /doesnotexist: No such file or directory\n")
    });

    it("longer than 10 lines", () => {
        CommandLine.push("/test2")
        tail(CommandLine.all())
        log<string>(CommandLine.all().join(" "));
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
    });

})