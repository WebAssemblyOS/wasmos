
import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs/fs';
import { openStdout, Hello, World, readString } from './fixtures';
import { main as echo } from "../bin/echo";

type fd = usize;



var stdout2: FileDescriptor;
// let stdout = Console.stdout;


describe("echo", (): void => {
  beforeAll(
    (): void => {
      stdout2 = openStdout();
    }
  );

  beforeEach((): void => {
    Console.stdout.reset();
    stdout2.reset();
    Console.stdout.erase()
    CommandLine.reset();
    CommandLine.push("echo");
  })

  it("should print newline by default", (): void => {
    CommandLine.push(Hello)
    CommandLine.push(World)
    echo(CommandLine.all())
    let str = Hello + " " + World + "\n";
    let stdoutStr = readString(stdout2)
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
    expect<string>(Console.stdout.readString().result).toBe(stdout2.readString().result);
  })
})
