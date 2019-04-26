import { Console, IO, fs, CommandLine } from "../../../assemblyscript/assembly/wasa/mock";
import { FileDescriptor, File } from "../../../assemblyscript/assembly/wasa/mock/fs";

import { main } from "../bin/echo";

let Hello = "Hello";
let World = "World";

function openFile(path: string): FileDescriptor {
  return fs.get(fs.openFile(path));
}

function openStdout(): FileDescriptor {
  return openFile("/dev/fd/1");
}

var stdout: FileDescriptor;
var stdout2: FileDescriptor;

describe("echo", (): void => {
  beforeEach((): void => {
    stdout = fs.get(Console.stdout)
    stdout.reset()
    stdout2 = openStdout();
    stdout.file.erase();
    CommandLine._args = new Array<string>();
    CommandLine.push("echo");

  })

  it("should print newline by default", (): void => {
    CommandLine.push(Hello)
    CommandLine.push(World)
    main(CommandLine.all())
    let str = Hello + " " + World + "\n";
    expect<u32>(stdout.offset).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
    stdout.reset();
    expect<string>(stdout.readString()).toBe(Hello + " " + World + "\n")
    stdout.reset();
    expect<string>(stdout.readString()).toBe(stdout2.readString());
  })

  it("should print no newline with -n", () => {
    CommandLine.push("-n")
    CommandLine.push(Hello)
    CommandLine.push(World)
    log(CommandLine.all())
    main(CommandLine.all())
    let offset = stdout.offset
    let str = Hello + " " + World;
    expect<u32>(offset).toBe(str.lengthUTF8, "One extra character for space")
    stdout.reset()
    expect<string>(stdout.readString()).toBe(Hello + " " + World)
  })
})
