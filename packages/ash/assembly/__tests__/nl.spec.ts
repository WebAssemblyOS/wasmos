import { main as nl } from "../bin/nl";
import { stdout, stderr } from './fixtures';


describe("nl", (): void => {
    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("nl");
    });

    it("with numbers", (): void => {
        CommandLine.push("/numbers")//See ./simple_fs.ts
        nl(CommandLine.all())
        let str = "    1  0\n    2  1\n    3  2\n    4  3\n    5  4\n    6  5\n" +
            "    7  6\n    8  7\n    9  8\n    10  9\n    11  10\n    12  11\n    13  12\n" +
            "    14  13\n    15  14\n    16  15\n    17  16\n    18  17\n    19  18\n    20  19";
        stdout.reset();
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "Two extra characters for space and \\n")
        expect<string>(stdout.readString().result).toStrictEqual(str);
    });

    it("with words", () => {
        CommandLine.push("/home/bob/documents/secret.txt");
        let str = "    1  For my eyes only.\n    2  No one else"
        nl(CommandLine.all());
        log<string>(stdout.readString().result)
        stdout.reset();
        expect<string>(stdout.readString().result).toStrictEqual(str);
        expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "Two extra characters for space and \\n");
    })

    it("should write to stderr if file not found", () => {
        CommandLine.push("/doesnotexist");
        nl(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("nl: /doesnotexist: No such file or directory\n")
    });
})