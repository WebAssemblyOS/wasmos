import { main as fold } from "../bin/fold";
import { stdout, Hello, World, Hello_World, stderr } from './fixtures';

describe("fold", (): void => {

    beforeEach((): void => {
        stdout.reset()
        Console.stdout.erase() //Erases and resets
        stderr.reset();
        Console.stderr.erase() //Erases and resets
        CommandLine.reset();
        CommandLine.push("fold");
    });

    it("pass width length", (): void => {
        CommandLine.push("-w");
        CommandLine.push("5");
        CommandLine.push("/test");
        fold(CommandLine.all())
        fs.reset(Console.stdout.fd)
        let output = fs.readString(Console.stdout.fd).result.split('\n');
        expect<number>(output.length).toBe(4);
        expect<string>(output[0]).toBe(Hello);
        expect<string>(output[1]).toBe(" Worl");
        expect<string>(output[2]).toBe("d");
        expect<string>(output[3]).toBe("");
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
        Console.stdout.reset();
        Console.stdout.erase();
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    });

    it("use default length", (): void => {
        CommandLine.push("/test");
        fold(CommandLine.all())
        fs.reset(Console.stdout.fd)
        let output = fs.readString(Console.stdout.fd).result.split('\n');
        // log<string>(fs.readString(Console.stdout.fd).result);
        expect<number>(output.length).toBe(2);
        expect<string>(output[0]).toBe(Hello_World);
        expect<string>(output[1]).toBe("");
        Console.stdout.reset()
        expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
    });

})
