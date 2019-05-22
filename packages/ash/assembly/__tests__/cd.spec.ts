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
    //Tests whether it fails when you try to go to a directory that does not exist
    it("go to nonexisting directory", () => {
        CommandLine.push("/doesnotexist");
        cd(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("Unable to open directory.\n")
    });
    //Tests whether it succeeds going to a directory that does exist
    it("go to existing directory", (): void => {
        CommandLine.push("/dev")
        cd(CommandLine.all())
        expect<string>(stdout.readString().result).toStrictEqual("Success\n")
    });
    // Tests whether the home directory is opened when cd has no arguments
    it("home directory when no arguemnts", () => {
      CommandLine.push("")
      cd(CommandLine.all())
      expect<string>(stdout.readString().result).toStrictEqual("Success\n")
    });
    //Tests whether it fails to open anything that is not a directory such as a file
    it("test if it would open a non-directory", (): void => {
        CommandLine.push("/test")
        cd(CommandLine.all())
        expect<string>(stderr.readString().result).toStrictEqual("Unable to open directory.\n")
    });

})
