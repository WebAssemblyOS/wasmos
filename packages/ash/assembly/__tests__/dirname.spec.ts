
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
    CommandLine.push(Hello + "/" + World);
    dirname(CommandLine.all());
    let str = Hello + "\n";
    let stdoutStr = readString(stdout)
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(Hello + "\n")
    Console.stdout.reset();
    expect<string>(readString(Console.stdout)).toBe(stdoutStr);
  });

  it("should print no newline with -z", () => {
    CommandLine.push("-z");
    CommandLine.push(Hello + "/" + World);
    dirname(CommandLine.all());
    let str = Hello;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  });

  it("should print no newline with --zero", () => {
    CommandLine.push("-z");
    CommandLine.push(Hello + "/" + World);
    dirname(CommandLine.all());
    let str = Hello;
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(str)
    Console.stdout.reset();
    expect<string>(Console.stdout.readString().result).toBe(stdout.readString().result);
  });

  it("should print '.' when path has no '/'", () => {
    CommandLine.push(Hello);
    dirname(CommandLine.all())
    expect<string>(readString(stdout)).toBe(".\n")

  });

  it("should handle multiple paths separated by newline", () => {
    CommandLine.push("-z");
    CommandLine.push(Hello + "/" + World);
    CommandLine.push(World + "/" + Hello);
    dirname(CommandLine.all());
    let str = Hello + " " + World;
    expect<string>(readString(stdout)).toBe(str);

  });
})
