
import { main as echo } from "../bin/echo";
let Hello = "Hello";
let World = "World";
let testFile: usize = 0;

type fd = usize;

function openStdout(): fd {
  return fs.openForRead("/dev/fd/1");
}

var stdout: fd;
var stdout2: fd;

describe("cat", (): void => {

  beforeEach((): void => {
    testFile = fs.openForWrite("/test");
    fs.writeString(testFile, Hello + " " + World);
    fs.reset(Console.stdout);
    fs.reset(stdout);
    stdout2 = openStdout();
    fs.erase(stdout);
    CommandLine.reset();
    CommandLine.push("cat");

  })

  it("should print newline by default", (): void => {
    // CommandLine.push(Hello)
    // CommandLine.push(World)
    // echo(CommandLine.all())
    // let str = Hello + " " + World + "\n";
    // expect<u32>(fs.tell(stdout)).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
    // fs.reset(stdout);
    // expect<string>(fs.readString(stdout)).toBe(Hello + " " + World + "\n")
    // fs.reset(stdout);
    // expect<string>(fs.readString(stdout)).toBe(fs.readString(stdout2));

  })

  it("should print no newline with -n", () => {
    // CommandLine.push("-n")
    // CommandLine.push(Hello)
    // CommandLine.push(World)
    // echo(CommandLine.all())
    // let offset = fs.tell(stdout);
    // let str = Hello + " " + World;
    // expect<u32>(fs.tell(stdout)).toBe(str.lengthUTF8, "Two extra characters for space and \\n")
    // fs.reset(stdout);
    // expect<string>(fs.readString(stdout)).toBe(Hello + " " + World + "\n")
    // fs.reset(stdout);
    // expect<string>(fs.readString(stdout)).toBe(fs.readString(stdout2));
  })
})
