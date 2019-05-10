import { Console, StringUtils, fs } from "../wasa/mock";
import { FileDescriptor } from '../wasa/mock/fs';
const STDOUT: string = "/dev/fd/1";
var stdout: FileDescriptor;
let jsonStr = '{"hello":"world"}';
var std_out: FileDescriptor;
var std_in: FileDescriptor;
var std_err: FileDescriptor;

beforeAll(
  (): void => {
    std_in = Console.stdin;
    std_out = Console.stdout;
    std_err = Console.stderr;
  }
);

describe("Console", (): void => {
  it("should be print hello World", (): void => {
    Console.log(jsonStr);
    let std1 = fs.get(std_out.fd).result;
    let std2 = fs.get(std_out.fd).result;
    expect<FileDescriptor>(std1).toStrictEqual(
      std2,
      "Two non-unique file descriptors points to the same object"
    );

    stdout = fs.openForRead("/dev/fd/1").result;
    expect<usize>(stdout.offset).toBe(
      0,
      "A fresh file descriptor has a seek (offset) of 0"
    );

    expect<u32>(std_out.offset).toBe(
      jsonStr.lengthUTF8 + 1, //Plus nil
      "length of string + \\n"
    );
    // expect<u32>(stdout.offset).toBe(0); //"new line addded"
    // let stdoutStr = fs.readString(stdout.id);
    let newLineStr = jsonStr + "\n";
    stdout.reset()
    expect<string>(stdout.readString()).toStrictEqual(newLineStr);
  });
});



describe("readLine", (): void => {
  it("should read until newline", (): void => {
    let str = "Hello\nWorld";
    let utfStr = str.toUTF8();
    expect<string>(StringUtils.fromCStringTilNewLine(utfStr)).toStrictEqual("Hello\n")
  })
})
