// The entry file of your WebAssembly module.

import { RNG } from "./random";

import { WasiResult } from "..";

export { WasiResult }
import { FileSystem, FileDescriptor, fd, Ref } from "./fs";
// export { FileDescriptor }

let DefaultFS = FileSystem.Default();
// @ts-ignore decorator is valid
@global
export class fs {
  private static _fs: FileSystem = DefaultFS;

  static set fs(_fs: FileSystem) {
    fs._fs = _fs;
  }

  static get fs(): FileSystem {
    return fs._fs;
  }
  /**
   * A simplified interface to open a file for read operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForRead(path: string, dirfd: fd = 3): WasiResult<FileDescriptor> {
    return this.fs.openFileAt(dirfd, path);
  }

  /**
   * A simplified interface to open a file for write operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForWrite(path: string, dirfd: fd = 3): WasiResult<FileDescriptor> {
    return this.fs.openFileAt(dirfd, path);
  }

  static openDirectory(path: string, dirfd: fd): WasiResult<FileDescriptor> {
    return this.fs.openDirectoryAt(dirfd, path)
  }
  /**
   * 
   * @param path path of new directory
   * @param dirfd File fd for 
   */
  static createDirectory(path: string, dirfd: fd = this.fs.cwd): WasiResult<FileDescriptor> {
    return this.fs.createDirectoryAt(dirfd, path);
  }

  /**
   * Close a file descriptor
   * @param fd file descriptor
   */
  static close(fd: fd): void {
    this.fs.close(fd);
  }

  /**
   * Write data to a file descriptor
   * @param fd file descriptor
   * @param data data
   */
  static write(fd: fd, data: Array<u8>): Wasi.errno {
    return this.fs.write(fd, data);
  }

  /**
   * Write a string to a file descriptor, after encoding it to UTF8
   * @param fd file descriptor
   * @param s string
   * @param newline `true` to add a newline after the string
   */
  static writeString(fd: fd, s: string, newline: boolean = false): Wasi.errno {
    return this.fs.writeString(fd, s, newline);
  }

  /**
   * Write a string to a file descriptor, after encoding it to UTF8, with a newline
   * @param fd file descriptor
   * @param s string
   */
  static writeStringLn(fd: fd, s: string): Wasi.errno {
    return this.writeString(fd, s, true);
  }

  /**
   * Read data from a file descriptor
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static read(fd: fd, data: Array<u8> = [], chunk_size: usize = 4096): Wasi.errno {
    return this.fs.read(fd, data);
  }

  /**
   * Read from a file descriptor until the end of the stream
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static readAll(fd: fd, data: Array<u8> = [], chunk_size: usize = 4096): Wasi.errno {
    if (this.fs.get(fd).failed) {
      return Wasi.errno.BADF;
    }
    data.buffer_ = changetype<ArrayBuffer>(this.fs.get(fd).result.data);
    return Wasi.errno.SUCCESS;
  }

  /**
   * Read an UTF8 string from a file descriptor, convert it to a native string
   * @param fd file descriptor
   * @param chunk_size chunk size (default: 4096)
   */
  static readString(fd: fd, chunk_size: usize = 4096): WasiResult<string> {
    return this.fs.readString(fd, chunk_size)
  }

  /**
   * Reach an UTF8 String from a file descriptor until a new line is reached.
   */
  static readLine(fd: fd, chunk_size: usize = 4096): WasiResult<string> {
    return this.fs.readline(fd, chunk_size)
  }

  static reset(fd: fd): void {
    this.seek(fd, 0, Wasi.whence.SET);
  }
  /**
   * 
   * @param fd File fd
   * returns the current offset of the file descriptor
   */
  static tell(fd: fd): usize {
    // TODO: add error check
    return this.fs.get(fd).result.offset;
  }

  /**
   * 
   * @param fd File fd
   * @param offset The number of bytes to move
   * @param whence The base from which the offset is relative
   */
  static seek(fd: fd, offset: Wasi.filedelta, whence: Wasi.whence = Wasi.whence.CUR): WasiResult<Ref<usize>> {
    return this.fs.seek(fd, offset, whence);
  }

  static get(fd: fd): WasiResult<FileDescriptor> {
    return this.fs.get(fd);
  }

  static erase(fd: fd): void {
    this.fs.erase(fd);
  }

}


export * from "./process";

// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
  /**  TODO: Add error checking */
  private static _stdin: FileDescriptor | null = null;
  private static _stdout: FileDescriptor | null = null;
  private static _stderr: FileDescriptor | null = null;

  static get stdin(): FileDescriptor {
    if (Console._stdin == null) {
      Console._stdin = fs.openForRead("/dev/fd/0").result;
    }
    return Console._stdin!;
  }

  static get stdout(): FileDescriptor {
    if (Console._stdout == null) {
      Console._stdout = fs.openForWrite("/dev/fd/1").result;
    }
    return Console._stdout!;
  }

  static get stderr(): FileDescriptor {
    if (Console._stderr == null) {
      Console._stderr = fs.openForRead("/dev/fd/2").result;
    }
    return Console._stderr!;
  }

  /**
   * Write a string to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static write(s: string, newline: boolean = false): void {
    this.stdout.writeString(s, newline);
  }

  /**
   * Read an UTF8 string from the console, convert it to a native string
   */
  static readAll(): string | null {
    return this.stdin.readString();
  }

  /**
   * Alias for `Console.write()`
   */
  static log(s: string): void {
    this.write(s, true);
  }

  /**
   * Write an error to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static error(s: string, newline: boolean = true): void {
    this.stderr.writeString(s, newline);
  }
}

export class Random {
  static RNG: RNG = RNG.fromSeed(42);

  /**
   * Fill a buffer with random data
   * @param buffer An array buffer
   */
  static randomFill(buffer: ArrayBuffer): void {
    for (let i = 0; i < buffer.byteLength; i++) {
      store<i8>(buffer.data, this.RNG.next(), i);
    }
  }

  /**
   * Return an array of random bytes
   * @param len length
   */
  static randomBytes(len: usize): Uint8Array {
    let array = new Uint8Array(len);
    this.randomFill(array.buffer);
    return array;
  }
}

export class Date {
  /**
   * Return the current timestamp, as a number of milliseconds since the epoch
   */
  static now(): f64 {
    let time_ptr = memory.allocate(8);
    let unix_ts = load<u64>(time_ptr);
    memory.free(time_ptr);
    return (unix_ts as f64) / 1000.0;
  }
}

export class Performance {
  static now(): f64 {
    let time_ptr = memory.allocate(8);
    let res_ts = load<u64>(time_ptr);
    memory.free(time_ptr);
    return res_ts as f64;
  }
}


export class EnvironEntry {
  constructor(readonly key: string, readonly value: string) { }
}

export class Environ {
  env: Array<EnvironEntry> = new Array<EnvironEntry>();

  add(key: string, value: string): void {
    this.env.push(new EnvironEntry(key, value));
  }

  /**
   *  Return all environment variables
   */
  all(): Array<EnvironEntry> {
    return this.env;
  }

  /**
   * Return the value for an environment variable
   * @param key environment variable name
   */
  get(key: string): string | null {
    for (let i = 0, j = this.env.length; i < j; i++) {
      if (this.env[i].key == key) {
        return this.env[i].value;
      }
    }
    return null;
  }
}
//@ts-ignore
@global
export class CommandLine {
  static _args: Array<string> = new Array<string>();

  static push(item: string): void {
    this._args.push(item);
  }

  /**
   * Return all the command-line arguments
   */
  static all(): Array<string> {
    return this._args;
  }

  /**
   * Return the i-th command-ine argument
   * @param i index
   */
  static get(i: usize): string | null {
    let args_len: usize = this._args[0].length;
    if (i < args_len) {
      return this._args[i];
    }
    return null;
  }

  get args(): Array<string> {
    return CommandLine._args;
  }
  /**
   * Deletes arguments
   */
  static reset(): void {
    while (this._args.length > 0) {
      this._args.pop();
    }
  }
}

const newLine: u8 = 10;

export class StringUtils {
  static isNewLine(ptr: usize): boolean {
    return load<u8>(ptr) == newLine;
  }

  static fromCString(cstring: usize, max: usize = 4096): string {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
    }
    return String.fromUTF8(cstring, size);
  }

  static fromCStringTilNewLine(cstring: usize, max: usize = 4096): string {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
      if (this.isNewLine(cstring + size - 1)) {
        break;
      }
    }
    return String.fromUTF8(cstring, size);
  }
}

