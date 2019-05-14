
import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World } from './mocks';
import { main as to } from "../bin/to";

type fd = usize;



var stdout2: FileDescriptor;
// let stdout = Console.stdout;


describe("to", (): void => {
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
    to();
    let str = Hello + " " + World + "\n";
    let stdoutStr = stdout2.readString()
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString()).toBe(Hello + " " + World + "\n")
    Console.stdout.reset();
    expect<string>(Console.stdout.readString()).toBe(stdoutStr);
  })
})
