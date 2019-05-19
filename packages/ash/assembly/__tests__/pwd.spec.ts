import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World } from './mocks';
import { main as to } from "../bin/pwd";

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
    CommandLine.push("pwd");
  })

  it("should give the root path", (): void => {

    // Don't know how to get value of root directory
    let rootStr = stdout2.readString()
    exepct<u32>(Console.stdout.readString()).toBe(rootStr)

  })

  it("switch directory", ():void => {
    //Creates directory test and switches into it
    fs.createDirectory("test")
    fs.openDirectory("test")
    CommandLine.push("pwd")
    let testDir = "/test"
    expect<u32>(Console.stdout.readString()).toBe(testDir)
  })
})