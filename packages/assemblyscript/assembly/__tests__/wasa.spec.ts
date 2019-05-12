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
    let file = _fs.openFileAt(fs.fs.cwd, "/test");
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
