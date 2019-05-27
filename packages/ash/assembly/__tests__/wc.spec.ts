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

  it("should write to stderr if incorrect number of arguments is passed", () => {
    CommandLine.push("-l")
    wc(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("wc -l: incorrect number of arguments\n")
  });


  it("should write to stderr if file not found", () => {
    CommandLine.push("-l")
    CommandLine.push("/doesnotexist");
    wc(CommandLine.all())
    expect<usize>(Console.stderr.tell()).toBeGreaterThan(0);
    expect<string>(stderr.readString().result).toStrictEqual("wc: /doesnotexist: open: No such file or directory\n")
  });

  it("with empty file", () => {
    CommandLine.push("-l")
    CommandLine.push("/empty.txt");
    let str = "\\t0: empty.txt";
    wc(CommandLine.all());
    stdout.reset();
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  })


  it("with file with single line", () => {
    CommandLine.push("-l")
    CommandLine.push("/singleLine.txt")
    wc(CommandLine.all())
    stdout.reset()
    let str = "\\t1: singleLine.txt";
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  })

  it("with file with multiple lines", () => {
    CommandLine.push("-l")
    CommandLine.push("/multipleLines.txt")
    wc(CommandLine.all())
    stdout.reset()
    let str = "\\t2: multipleLines.txt";
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  })

  it("with file without explicit new line termination", () => {
    CommandLine.push("-l")
    CommandLine.push("/withoutExplicitNewLine.txt")
    wc(CommandLine.all())
    stdout.reset()
    let str = "\\t1: withoutExplicitNewLine.txt";
    expect<string>(stdout.readString().result).toStrictEqual(str);
    expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "FD offset should be length of string");
  })

})