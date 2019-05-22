
import { stdout, Hello, World, readString } from './fixtures';
import { main as dirname } from "../bin/dirname";

describe("dirname", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("dirname");
  })

  it("should print newline by default", (): void => {
    CommandLine.push(Hello)
    CommandLine.push(World)
    dirname(CommandLine.all())
    let str = Hello + " " + World + "\n";
    let stdoutStr = readString(stdout)
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(Hello + " " + World + "\n")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(stdoutStr);
  });

  it("should print no newline with -z", () => {
    CommandLine.push("-n")
    CommandLine.push(Hello)
    CommandLine.push(World)
    dirname(CommandLine.all())
    let str = Hello + " " + World;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  });

  it("should print no newline with --zero", () => {
    CommandLine.push("-n")
    CommandLine.push(Hello)
    CommandLine.push(World)
    dirname(CommandLine.all())
    let str = Hello + " " + World;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  });

  it("should print '.' when path has no '/'", () => {
    CommandLine.push("$PATH");
    let path = "/usr/bin:/bin";
    Environ.add("$PATH", path);
    dirname(CommandLine.all())
    expect<string>(readString(stdout)).toBe(path + "\n")

  });

  it("should handle multiple paths separated by newline", () => {
    CommandLine.push("$PATH");
    let path = "/usr/bin:/bin";
    Environ.add("$PATH", path);
    dirname(CommandLine.all())
    expect<string>(readString(stdout)).toBe(path + "\n")

  });

  it("should handle multiple paths separated by NUL when -z is given", () => {
    CommandLine.push("$PATH");
    let path = "/usr/bin:/bin";
    Environ.add("$PATH", path);
    dirname(CommandLine.all())
    expect<string>(readString(stdout)).toBe(path + "\n")

  });
})
