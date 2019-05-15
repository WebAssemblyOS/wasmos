import { main as head } from "../bin/head";
import { stdout, stderr } from './fixtures';


describe("head", (): void => {

    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("head");
    });

    it("should print 10 lines by default", (): void => {
        CommandLine.push("/numbers")//See ./simple_fs.ts
        head(CommandLine.all())
        let str = "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n";
        log<string>(stdout.readString().result)
        stdout.reset();
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "Two extra characters for space and \\n")
        expect<string>(stdout.readString().result).toStrictEqual(str);
    });

    it("should write to stderr if file not found", () => {
        CommandLine.push("/doesnotexist");
        head(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("head: /doesnotexist: No such file or directory\n")
    });

})
