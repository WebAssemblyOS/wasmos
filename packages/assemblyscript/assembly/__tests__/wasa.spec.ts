import { Console, IO, fs, StringUtils } from "../wasa/mock";
import * as echo from "../bin/echo";
import { JSONDecoder } from "../../node_modules/assemblyscript-json/assembly/decoder";
import { JSONEncoder } from "../../node_modules/assemblyscript-json/assembly/encoder";
import { FileDescriptor } from "../wasa/mock/fs";

let jsonStr = '{"hello":"world"}';

const STDOUT: string = "/dev/fd/1";
var stdout: FileDescriptor;
var encoder: JSONEncoder;

var std_out: FileDescriptor;
var std_in: FileDescriptor;
var std_err: FileDescriptor;

function roundripTest(jsonString: string, expectedString: string = ""): bool {
  log("--------" + jsonString + (expectedString ? " " + expectedString : ""));
  expectedString = expectedString || jsonString;
  let buffer: Uint8Array = new Uint8Array(jsonString.lengthUTF8);
  let utf8ptr = jsonString.toUTF8();
  // TODO: std should expose memcpy?
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = load<u8>(utf8ptr + i);
  }
  let decoder: JSONDecoder<JSONEncoder> = new JSONDecoder(encoder);
  decoder.deserialize(buffer);
  let resultBuffer = encoder.serialize();
  let resultString = String.fromUTF8(
    resultBuffer.buffer.data,
    resultBuffer.length
  );
  expect<string>(resultString).toStrictEqual(expectedString);
  expect<String>(encoder.toString()).toStrictEqual(expectedString);
  return true;
}

beforeAll(
  (): void => {
    encoder = new JSONEncoder();
    std_in = fs.get(Console.stdin);
    std_out = fs.get(Console.stdout);
    std_err = fs.get(Console.stderr);
  }
);

describe("Console", (): void => {
  it("should be print hello World", (): void => {
    Console.log(jsonStr);
    let std1 = fs.get(std_out.id);
    let std2 = fs.get(std_out.id);
    expect<FileDescriptor>(std1).toStrictEqual(
      std2,
      "Two non-unique file descriptors points to the same object"
    );

    stdout = fs.get(fs.openFile("/dev/fd/1"));
    expect<usize>(stdout.offset).toBe(
      0,
      "A fresh file descriptor has a seek (offset) of 0"
    );

    expect<u32>(std_out.offset).toBe(
      jsonStr.lengthUTF8 + 1,
      "length of string + \\n"
    );
    // expect<u32>(stdout.offset).toBe(0); //"new line addded"
    // let stdoutStr = fs.readString(stdout.id);
    let newLineStr = jsonStr + "\n";
    expect<string>(stdout.readString()).toStrictEqual(newLineStr);
  });
});

describe("Json", (): void => {
  it("simple hello world", (): void => {
    roundripTest(jsonStr, jsonStr);
  });
});

describe("readLine", (): void => {
  it("should read until newline", (): void => {
    let str = "Hello\nWorld";
    let utfStr = str.toUTF8();
    expect<string>(StringUtils.fromCStringTilNewLine(utfStr)).toStrictEqual("Hello\n")
  })
})
