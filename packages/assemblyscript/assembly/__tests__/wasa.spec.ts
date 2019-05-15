import { Console, StringUtils, fs } from "../wasa/mock";
import { FileDescriptor } from '../wasa/mock/fs';
import * as path from "../wasa/mock/path";
import { FileSystem } from '../wasa/mock/fs/fs';
import { Wasi } from '../wasi';
import { WasiResult } from '../wasa/index';

const STDOUT: string = "/dev/fd/1";
var stdout: WasiResult<FileDescriptor>;
let jsonStr = '{"hello":"world"}';
let _fs: FileSystem;

beforeAll(() => {
  _fs = fs.fs;
  _fs.init();
})

describe("Console", (): void => {
  it("should be print hello World", (): void => {
    Console.log(jsonStr);
    let std1 = fs.get(Console.stdout.fd).result;
    let std2 = fs.get(Console.stdout.fd).result;
    expect<FileDescriptor>(std1).toStrictEqual(
      std2,
      "Two non-unique file descriptors points to the same object"
    );

    stdout = fs.openFile("/dev/fd/1");
    expect<usize>(stdout.result.offset).toBe(
      0,
      "A fresh file descriptor has a seek (offset) of 0"
    );

    expect<u32>(Console.stdout.offset).toBe(
      jsonStr.lengthUTF8 + 1, //Plus nil
      "length of string + \\n"
    );
    // expect<u32>(stdout.offset).toBe(0); //"new line addded"
    // let stdoutStr = fs.readString(stdout.id);
    let newLineStr = jsonStr + "\n";
    stdout.result.reset()
    expect<string>(stdout.result.readString().result).toStrictEqual(newLineStr);
  });
});



describe("readLine", (): void => {
  it("should read until newline", (): void => {
    let str = "Hello\nWorld";
    let utfStr = str.toUTF8();
    expect<string>(StringUtils.fromCStringTilNewLine(utfStr, str.lengthUTF8)).toStrictEqual("Hello\n")
  });

  it("should read null when reading from a terminating char", (): void => {
    let str = "Hello World";
    let utfStr = str.toUTF8();
    expect<string>(StringUtils.fromCStringTilNewLine(utfStr + str.lengthUTF8, str.lengthUTF8)).toBeNull();
  });

  it("should read chunk", () => {
    let hello = "Hello ";
    let world = hello + "World";
    expect<string>(StringUtils.fromCString(world.toUTF8(), hello.lengthUTF8)).toStrictEqual(hello);
  });
});

describe("Open", (): void => {
  it("full path should work", (): void => {
    let _path = "/Hello/World";
    expect<bool>(fs.fs.paths.has("/")).toBeTruthy();
    let res = _fs.fullPath(_path);
    expect<string>(path.dirname("/test")).toBe("/");
    expect<string>(res).toStrictEqual(_path);
  });

  it("create a top level file", (): void => {
    let file = _fs.createFileAt(fs.fs.cwd, "./test");
    expect<bool>(file.failed).toBeFalsy();
    expect<string>(file.result.file!.path).toStrictEqual("/test");
  });

  it("should create a top level directory", (): void => {
    let dir = _fs.createDirectory("/dev");
    expect<bool>(dir.failed).toBeFalsy(Wasi.errno.toString(dir.error));
  });

  it("should fail if parent doesn't exist", (): void => {
    let dir = _fs.createDirectory("/foo/test");
    log<string>(Wasi.errno.toString(dir.error));
    expect<bool>(dir.failed).toBeTruthy();
  });

});

describe("read", (): void => {
  it("read string should return error if offset is at the eof", () => {
    let file = _fs.createFile("./tmp");
    file.result.erase();
    expect<Wasi.errno>(file.result.readString().error).toBe(Wasi.errno.NOMEM);
  });
})

let file: FileDescriptor;
describe("write", (): void => {

  beforeEach(() => {
    file = _fs.createFile("./tmp").result;
    file.erase();
  });

  it("should update size after a write", () => {
    expect<usize>(file.size).toBe(0);
    let str = "hello world";
    expect<Wasi.errno>(file.writeString("hello world")).toBe(Wasi.errno.SUCCESS)
    expect<usize>(file.size).toBe(str.lengthUTF8);
  });

  it("should not update size if offset is less than size", (): void => {
    let str = "hello world";
    expect<Wasi.errno>(file.writeString("hello world")).toBe(Wasi.errno.SUCCESS)
    file.reset();
    expect<Wasi.errno>(file.writeString("HELLO")).toBe(Wasi.errno.SUCCESS)
    expect<usize>(file.size).toBe(str.lengthUTF8);
  })
})
