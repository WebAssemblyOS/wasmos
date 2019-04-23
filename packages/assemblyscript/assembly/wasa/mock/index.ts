// The entry file of your WebAssembly module.

import { RNG } from "./random";
import { Filesystem as _fs, FileDescriptor, Stdout } from "./fs";

let fs = _fs.Default();
export { fs };
var fd = 1;
export type Descriptor = usize;

export class Filesystem {
  /**
   * A simplified interface to open a file for read operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForRead(path: string, dirfd: Descriptor = 3): Descriptor {
    return fs.open(path);
  }

  /**
   * A simplified interface to open a file for write operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForWrite(path: string, dirfd: Descriptor = 3): Descriptor {
    return fs.open(path);
  }
}

export class IO {
  data: Uint8Array;
  /**
   * Close a file descriptor
   * @param fd file descriptor
   */
  static close(fd: Descriptor): void {
    fs.close(fd);
  }

  /**
   * Write data to a file descriptor
   * @param fd file descriptor
   * @param data data
   */
  static write(fd: Descriptor, data: Array<u8>): void {
    fs.write(fd, data);
  }

  /**
   * Write a string to a file descriptor, after encoding it to UTF8
   * @param fd file descriptor
   * @param s string
   * @param newline `true` to add a newline after the string
   */
  static writeString(fd: Descriptor, s: string, newline: bool = false): void {
    let str = s + (newline ? "\n" : "");
    fs.get(fd).writeString(str);
  }

  /**
   * Write a string to a file descriptor, after encoding it to UTF8, with a newline
   * @param fd file descriptor
   * @param s string
   */
  static writeStringLn(fd: Descriptor, s: string): void {
    this.writeString(fd, s, true);
  }

  /**
   * Read data from a file descriptor
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static read(
    fd: Descriptor,
    data: Array<u8> = [],
    chunk_size: usize = 4096
  ): Array<u8> | null {
    return data;
  }

  /**
   * Read from a file descriptor until the end of the stream
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static readAll(
    fd: Descriptor,
    data: Array<u8> = [],
    chunk_size: usize = 4096
  ): Array<u8> | null {
    return data;
  }

  /**
   * Read an UTF8 string from a file descriptor, convert it to a native string
   * @param fd file descriptor
   * @param chunk_size chunk size (default: 4096)
   */
  static readString(fd: Descriptor, chunk_size: usize = 4096): string | null {
    let s = "hello world";
    return s;
  }

  static reset(fd: Descriptor): void {
    fs.get(fd).reset();
  }
}

// @ts-ignore: Decorators *are* valid here!
@global
export class Console {
  private static _stdin: Descriptor | null = null;
  private static _stdout: Descriptor | null = null;
  private static _stderr: Descriptor | null = null;

  static get stdin(): Descriptor {
    if (Console._stdin == null) {
      Console._stdin = Filesystem.openForRead("/dev/fd/0");
    }
    return Console._stdin;
  }

  static get stdout(): Descriptor {
    if (Console._stdout == null) {
      Console._stdout = Filesystem.openForWrite("/dev/fd/1");
    }
    return Console._stdout;
  }

  static get stderr(): Descriptor {
    if (Console._stderr == null) {
      Console._stderr = Filesystem.openForRead("/dev/fd/2");
    }
    return Console._stderr;
  }

  /**
   * Write a string to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static write(s: string, newline: bool = true): void {
    IO.writeString(this.stdout, s, newline);
  }

  /**
   * Read an UTF8 string from the console, convert it to a native string
   */
  static readAll(): string | null {
    return IO.readString(this.stdin);
  }

  /**
   * Alias for `Console.write()`
   */
  static log(s: string): void {
    this.write(s);
  }

  /**
   * Write an error to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static error(s: string, newline: bool = true): void {
    IO.writeString(this.stdout, s, newline);
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

export class Process {
  /**
   * Cleanly terminate the current process
   * @param status exit code
   */
  static exit(status: u32): void {
    abort();
  }
}

export class EnvironEntry {
  constructor(readonly key: string, readonly value: string) {}
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

export class CommandLine {
  args: Array<string> = new Array<string>();

  push(item: string): void {
    this.args.push(item);
  }

  /**
   * Return all the command-line arguments
   */
  all(): Array<string> {
    return this.args;
  }

  /**
   * Return the i-th command-ine argument
   * @param i index
   */
  get(i: usize): string | null {
    let args_len: usize = this.args[0].length;
    if (i < args_len) {
      return this.args[i];
    }
    return null;
  }
}

export class StringUtils {
  static fromCString(cstring: usize): string {
    let size = 0;
    while (load<u8>(cstring + size) != 0) {
      size++;
    }
    return String.fromUTF8(cstring, size);
  }
}
