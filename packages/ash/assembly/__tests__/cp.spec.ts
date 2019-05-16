import { stdout, Hello, World, readString, stderr } from './fixtures';
import { main as cp } from "../bin/cp";

describe("cp", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
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
    CommandLine.push("/test");
    cp(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("cp: /doesnotexist: No such file or directory\n")
  });

  it("should copy source file to destination file", (): void => {

  });

  it("should copy source file to destination file even if destination file isn't found", (): void => {

  });

  it("should copy source file to destination directory", () => {

  });

  it("should copy multiple source files to destination directory", () => {

  });
})
