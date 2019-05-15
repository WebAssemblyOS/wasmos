
import { stdout, Hello, World, readString, Hello_World } from './fixtures';
import { main as to } from "../bin/to";

const testtext1 = "This is some new text.";
const testtext2 = "This is even newer text.";

describe("to", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("to");
  })

  it("should print testtext1 to std out", (): void => {
    CommandLine.push(testtext1)
    CommandLine.push("/test")
    to(CommandLine.all());
    let stdoutStr = readString(stdout)
    expect<string>(stdoutStr).toBe(testtext1);
  });

  it("test file should contain testtext1", (): void => {
    CommandLine.push(testtext1)
    CommandLine.push("/test")
    to(CommandLine.all());
    let stdoutStr = readString(stdout)
    expect<string>(stdoutStr).toBe(testtext1);
    let openTextFile = fs.openForRead("/test");
    expect<bool>(openTextFile.failed).toBeFalsy("test file should be able to be read");
    let readTextFile = openTextFile.result.readString();
    expect<bool>(readTextFile.failed).toBeFalsy();
    let fileText = readTextFile.result;
    expect<string>(fileText).toBe(testtext1);
  });

  it("should print out and write the most recent text to the same file", (): void => {
    CommandLine.push(testtext1)
    CommandLine.push("/test")
    to(CommandLine.all());
    let stdoutStr = readString(stdout)
    expect<string>(stdoutStr).toBe(testtext1);
    expect<string>(fs.openForRead("/test").result.readString().result).toBe(testtext1);

    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("to");

    CommandLine.push(testtext2)
    CommandLine.push("/test")
    to(CommandLine.all());
    let newStdoutStr = readString(stdout)
    expect<string>(newStdoutStr).toBe(testtext2);
    expect<string>(fs.openForRead("/test").result.readString().result).toBe(testtext2);
  });

  it("should create a new file if the file doesn't exist", (): void => {
    CommandLine.push(testtext1)
    CommandLine.push("/test2")
    to(CommandLine.all());
    let stdoutStr = readString(stdout)
    expect<string>(stdoutStr).toBe(testtext1);
    let openTextFile = fs.openForRead("/test2");
    expect<bool>(openTextFile.failed).toBeFalsy("test file should be able to be read");
    let readTextFile = openTextFile.result.readString();
    expect<bool>(readTextFile.failed).toBeFalsy();
    let fileText = readTextFile.result;
    expect<string>(fileText).toBe(testtext1);
  });

})
