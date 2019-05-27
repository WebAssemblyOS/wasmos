import { main as which } from "../bin/which";
import { stdout, readString } from "./fixtures"

let path: string;

describe("echo", (): void => {
    beforeAll(
        (): void => {
            path = "/home/bob/code";
            Environ.add("$PATH", path);
        }
    );

    it("should print $PATH environment variable", () => {
        CommandLine.push("README.md");
        log<string>(Environ.get("$PATH"));
        which(CommandLine.all())
        expect<string>(readString(stdout)).toBe(path + "/" + "README.md" + "\n")
    });

    beforeEach((): void => {
        stdout.reset();
        Console.stdout.reset();
        Console.stdout.erase();
        CommandLine.reset();
        CommandLine.push("which");
    })

    // it("should find a file in my path", (): void => {
    //     CommandLine.push("foo")
    //     which(CommandLine.all())
    //     Console.stdout.reset();
    //     expect<string>(Console.stdout.readString().result).toBe("/test/foo")
    // })
})

