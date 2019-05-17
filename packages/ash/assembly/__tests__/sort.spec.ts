import { main as sort } from "../bin/sort";
import { stdout, Hello, World, testFile, stderr, Hello_World } from './fixtures';


describe("sort", (): void => {

    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("sort");
    });

    it("should write to stderr if file not found", () => {
        CommandLine.push("/doesnotexist");
        sort(CommandLine.all())
        expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
        expect<string>(stderr.readString().result).toStrictEqual("sort: /doesnotexist: No such file or directory\n")
    });

    it("should write from multiple files", () => {
        CommandLine.push("/test")
        CommandLine.push("/numbers")
        sort(CommandLine.all())
        log<string>(stdout.readString().result);
        expect<usize>(Console.stdout.tell()).toBeGreaterThan(Hello_World.lengthUTF8 - 1);

        let line = stdout.readString();
        while (!line.failed) {

            let line2 = stdout.readString();

            if (line2.failed) {
                break;
            }

            expect<string>(line.result).toBeLessThanOrEqualTo(line2.result);

            line = line2;
        }
    });

})
