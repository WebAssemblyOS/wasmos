
import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { openStdout, Hello, World, readString } from './fixtures';
import { main as to } from "../bin/to";

type fd = usize;



// var stdout2: FileDescriptor;
// let stdout = Console.stdout;

const testtxt1: string = "testtxt1";
const testtxt2: string = "This is some text.";

const testfile1: string = "./testfile1.txt";
const testfile2: string = "./testfile2.txt";

describe("to", (): void => {
  beforeAll(
    (): void => {
      // stdout2 = openStdout();
    }
  );

  beforeEach((): void => {
    Console.stdout.reset();
    // stdout2.reset();
    Console.stdout.erase()
    // fs.delete(testfile1);
    // fs.delete(testfile2);
    CommandLine.reset();
    CommandLine.push("to");
  })

  it("should print testtxt1", (): void => {
    CommandLine.push(testtxt1)
    CommandLine.push(testfile1)
    to(CommandLine.all());
    // let stdoutStr: string = stdout2.readString().result
    // let stdoutStr: string = Console.stdout.readString().result;
    // let stderrStr: string = Console.stderr.readString().result;
    // let stdoutStr: string = readString(Console.stdout);
    // let stderrStr: string = readString(Console.stderr);
    let stdoutStr: string = fs.readString(Console.stdout.fd).result;
    let stderrStr: string = fs.readString(Console.stderr.fd).result;
    log<string>("stdoutStr: " + stdoutStr);
    log<string>("stderrStr: " + stderrStr);
    expect<string>(stderrStr).toBe("");
    expect<string>(stdoutStr).toBe(testtxt1);
  })
})
