
import { stdout, Hello, World, readString } from './fixtures';
import { main as echo } from "../bin/echo";

describe("echo", (): void => {
  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("echo");
  })

  it("should print newline by default", (): void => {
    CommandLine.push(Hello)
    CommandLine.push(World)
    echo(CommandLine.all())
    let str = Hello + " " + World + "\n";
    let stdoutStr = readString(stdout)
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(Hello + " " + World + "\n")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(stdoutStr);
  })

  it("should print no newline with -n", () => {
    CommandLine.push("-n")
    CommandLine.push(Hello)
    CommandLine.push(World)
    echo(CommandLine.all())
    let str = Hello + " " + World;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 + 1, "Two extra characters for space and \\n")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  })
})
