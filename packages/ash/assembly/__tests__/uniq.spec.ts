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

    it("should not affect single line", (): void => {
        CommandLine.push("/test")
        uniq(CommandLine.all())
        let str = Hello_World + "\n";
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "String doesn't have a terminating NUL")
        fs.reset(Console.stdout.fd)
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    });

    it("should remove consecutive duplicates", () => {
        CommandLine.push("/uniqify")
        uniq(CommandLine.all())

        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + " " + World + "\n")
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + "\n")
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(World + "\n")
        expect<string>(fs.readString(Console.stdout.fd).result).toBe(Hello + "\n")
    });
})
