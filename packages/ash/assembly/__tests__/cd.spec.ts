import { main as cd } from "../bin/cd";
import { stdout, stderr } from './fixtures';

describe("cd", (): void => {
    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase()
        stderr.reset();
        Console.stderr.erase()
        CommandLine.reset();
        CommandLine.push("cd");
    });
    it("go to nonexisting directory", () => {
        CommandLine.push("/doesnotexist");
        cd(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("Unable to open directory.\n")
    });

    it("go to existing directory", (): void => {
        CommandLine.push("/dev")
        cd(CommandLine.all())
        expect<string>(stdout.readString().result).toStrictEqual("Success\n")
    });
    it("home directory when no arguemnts", () => {
      CommandLine.push("")
      cd(CommandLine.all())
      expect<string>(stdout.readString().result).toStrictEqual("Success\n")
    });
    it("test if it would open a non-directory", (): void => {
        CommandLine.push("/test")
        cd(CommandLine.all())
        expect<string>(stderr.readString().result).toStrictEqual("Unable to open directory.\n")
    });

})
