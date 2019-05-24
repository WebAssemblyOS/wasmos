import { main as wc } from "../bin/wc";
import { stdout, stderr } from './fixtures';


describe("wc", (): void => {
  beforeEach((): void => {
    stdout.reset()
    Console.stdout.erase() //Erases and resets
    stderr.reset();
    Console.stderr.erase() //Erases and resets
    CommandLine.reset();
    CommandLine.push("wc");
  });

  it("should write to stderr if file not found", () => {
    CommandLine.push("-l")
    CommandLine.push("/doesnotexist");
    wc(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("wc: /doesnotexist: open: No such file or directory\n")
  });

  /* it("options - l", () => {
    CommandLine.push("-b")
    CommandLine.push("t")
    CommandLine.push("/home/bob/documents/secret.txt");
    let str = "    1  For my eyes only.\n    2   No one else"
    wc(CommandLine.all());
    stdout.reset();
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  })

  it("options - n", () => {
    CommandLine.push("-b")
    CommandLine.push("n")
    CommandLine.push("/home/bob/documents/secret.txt")
    wc(CommandLine.all())
    stdout.reset()
    let str = "       For my eyes only.\n        No one else"
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  }) */

})