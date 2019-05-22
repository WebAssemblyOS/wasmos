import { stdout, Hello, World, readString, stderr, openFile } from './fixtures';
import { main as cp } from "../bin/cp";

describe("cp", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    stderr.reset();
    Console.stderr.erase();
    CommandLine.reset();
    CommandLine.push("cp");
  })

  it("should write to stderr if less than 3 arguments", (): void => {
    CommandLine.push("/test");
    cp(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("usage: cp source_file target_file\ncp source_file ... target_directory\n")
  });

  it("should write to stderr if source file not found", (): void => {
    CommandLine.push("/doesnotexist");
    CommandLine.push("/home");
    cp(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("cp: /doesnotexist: No such file or directory\n")
  });

  it("should create new file and copy if destination file isn't found", (): void => {
    CommandLine.push("/test");
    CommandLine.push("/newfile");
    cp(CommandLine.all());
    expect<string>(openFile("/newfile").readString().result).toStrictEqual("Hello World");
  });

  it("should copy source file to destination directory", () => {
    CommandLine.push("/test");
    CommandLine.push("/home");
    cp(CommandLine.all());
    expect<bool>(fs.openFile("/home/test").failed).toBeFalsy();
    expect<string>(openFile("/home/test").readString().result).toStrictEqual("Hello World");
  });

  it("should copy multiple source files to destination directory", () => {
    CommandLine.push("/test");
    CommandLine.push("/numbers");
    CommandLine.push("/home");
    cp(CommandLine.all());
    expect<bool>(fs.openFile("/home/test").failed).toBeFalsy();
    expect<bool>(fs.openFile("/home/numbers").failed).toBeFalsy();
    expect<string>(openFile("/home/test").readString().result).toStrictEqual("Hello World");
    expect<string>(openFile("/home/numbers").readString().result).toStrictEqual("0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19");
  });

  it("should copy source file to destination file", (): void => {
    CommandLine.push("/test");
    CommandLine.push("/numbers");
    cp(CommandLine.all());
    expect<string>(openFile("/numbers").readString().result).toStrictEqual("Hello World");
  });
})
