
declare class Ref<T>{
  val: T;
}
declare class Tuple<T1, T2> {
  first: T1;
  second: T2;
}

declare class WasiResult<T> extends Tuple<T | null, Wasi.errno> {
  constructor(first: T | null, second?: Wasi.errno);

  failed: boolean;
  error: Wasi.errno;
  result: T;
  static resolve<T>(result: T): WasiResult<T>;
  static fail<T>(err: Wasi.errno): WasiResult<T>;
  static void<T>(res: Wasi.errno): WasiResult<T>;
}

declare type fd = usize;
declare type path = string;

declare class Console {
  /**
   * Write a string to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static write(s: string, newline?: boolean): void;

  /**
   * Read an UTF8 string from the console, convert it to a native string
   */
  static readAll(): string | null;

  /**
   * Alias for `Console.write()`
   */
  static log(s: string): void;

  /**
   * Write an error to the console
   * @param s string
   * @param newline `false` to avoid inserting a newline after the string
   */
  static error(s: string, newline?: boolean): void;

  static stdout: fd;
  static stdin: fd;
  static stderr: fd;
}
// // declare const Cons: number;
// // declare function Cons1(): void;
// // declare type IO = wasa.IO;
declare function abort(): void;



declare class CommandLine {
  static all(): Array<string>
  static push(s: string): void;
  static reset(): void;
}

declare class FileDescriptor {
  erase(): void

  file: File;
  fd: u32;
  offset: u32;

  write(bytes: Array<u8>): void;

  writeString(str: string, newline?: bool): void;

  copyByte(ptr: usize): void;

  writeByte(byte: u8): void;

  read(bytes: Array<u8>): void;

  readByte(): u8;

  pread(bytes: Array<u8>): void;

  readString(): string;

  tell(): u32;


  /**
   * Resets the offset to 0
   */
  reset(): void;

  /**
   * set seek (offset)
   */
  seek(offset: usize): void;

  data: usize;
}


declare class File {
  static DefaultSize: u32;
  data: usize;
  grow(): File;
}


declare class Directory extends File {
  parent: Directory;
  children: Array<File>;
}

declare class fs {
  /**
   * A simplified interface to open a file for read operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForRead(path: string, dirfd?: fd): WasiResult<FileDescriptor>;

  /**
   * A simplified interface to open a file for write operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForWrite(path: string, dirfd?: fd): WasiResult<FileDescriptor>;

  static openDirectory(path: string, dirfd?: fd): WasiResult<FileDescriptor>;
  /**
   * 
   * @param path path of new directory
   * @param dirfd File fd for 
   */
  static createDirectory(path: string, dirfd?: fd): WasiResult<FileDescriptor>;

  /**
   * Close a file descriptor
   * @param fd file descriptor
   */
  static close(fd: fd): void;

  /**
   * Write data to a file descriptor
   * @param fd file descriptor
   * @param data data
   */
  static write(fd: fd, data: Array<u8>): Wasi.errno;

  /**
   * Write a string to a file descriptor, after encoding it to UTF8
   * @param fd file descriptor
   * @param s string
   * @param newline `true` to add a newline after the string
   */
  static writeString(fd: fd, s: string, newline?: boolean): Wasi.errno;

  /**
   * Write a string to a file descriptor, after encoding it to UTF8, with a newline
   * @param fd file descriptor
   * @param s string
   */
  static writeStringLn(fd: fd, s: string): Wasi.errno;

  /**
   * Read data from a file descriptor
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static read(fd: fd, data: Array<u8>, chunk_size?: usize): Wasi.errno;

  /**
   * Read from a file descriptor until the end of the stream
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static readAll(fd: fd, data: Array<u8>, chunk_size?: usize): Wasi.errno;

  /**
   * Read an UTF8 string from a file descriptor, convert it to a native string
   * @param fd file descriptor
   * @param chunk_size chunk size (default: 4096)
   */
  static readString(fd: fd, chunk_size?: usize): WasiResult<string>;

  /**
   * Reach an UTF8 String from a file descriptor until a new line is reached.
   */
  static readLine(fd: fd, chunk_size: usize): WasiResult<string>;

  static reset(fd: fd): void;
  /**
   * 
   * @param fd File fd
   * returns the current offset of the file descriptor
   */
  static tell(fd: fd): usize;

  /**
   * 
   * @param fd File fd
   * @param offset The number of bytes to move
   * @param whence The base from which the offset is relative
   */
  static seek(fd: fd, offset: Wasi.filedelta, whence?: Wasi.whence): WasiResult<Ref<usize>>;

  static get(fd: fd): WasiResult<FileDescriptor>;

  static erase(fd: fd): void;


}


declare class Process {
  static exit(code: number): void;
}