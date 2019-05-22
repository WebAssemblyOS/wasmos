import { main as uniq } from "../bin/uniq";
import { stdout, Hello, World, Hello_World, stderr } from './fixtures';


describe("uniq", (): void => {
    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("uniq");
    });

    it("uniqifies one line", (): void => {
        CommandLine.push("/test")
        uniq(CommandLine.all())
        let str = Hello_World + "\n";
        Console.stdout.reset();
        log<string>(Console.stdout.readString().result);
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "String doesn't have a terminating NUL")
        fs.reset(Console.stdout.fd)
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    });

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
