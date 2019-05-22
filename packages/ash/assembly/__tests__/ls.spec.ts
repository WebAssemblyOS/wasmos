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
        ls(CommandLine.all());
        log<string>(CommandLine.all().join(" "));

        log<string>(readString(stdout));
        stdout.reset();
        expect<string>(stdout.readString().result).toBe("dev test home numbers\n");
    });

    // it("should print newline by default", (): void => {
    //     CommandLine.push("/test")
    //     cat(CommandLine.all())
    //     let str = Hello_World + "\n";
    //     expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "String doesn't have a terminating NUL")
    //     fs.reset(Console.stdout.fd)
    //     expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
    //     Console.stdout.reset()
    //     expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    // });

    // it("should write to stderr if file not found", () => {
    //     CommandLine.push("/doesnotexist");
    //     cat(CommandLine.all())
    //     expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    //     expect<string>(stderr.readString().result).toStrictEqual("cat: /doesnotexist: No such file or directory\n")
    // });

    // it("should write from multiple files", () => {
    //     CommandLine.push("/test")
    //     CommandLine.push("/numbers")
    //     cat(CommandLine.all())
    //     expect<usize>(Console.stdout.tell()).toBeGreaterThan(Hello_World.lengthUTF8 - 1);
    // });

})
