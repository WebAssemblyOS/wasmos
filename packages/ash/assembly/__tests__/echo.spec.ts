
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
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(Hello + " " + World + "\n")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(stdoutStr);
  });

  it("should print no newline with -n", () => {
    CommandLine.push("-n")
    CommandLine.push(Hello)
    CommandLine.push(World)
    echo(CommandLine.all())
    let str = Hello + " " + World;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  });

  it("should print $PATH environment variable", () => {
    CommandLine.push("$PATH");
    let path = "/usr/bin:/bin";
    Environ.add("$PATH", path);
    echo(CommandLine.all())
    expect<string>(readString(stdout)).toBe(path + "\n")

  });
})
