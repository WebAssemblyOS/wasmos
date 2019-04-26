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
}
// // declare const Cons: number;
// // declare function Cons1(): void;
// // declare type IO = wasa.IO;
declare function abort(): void;



declare class CommandLine {
  static all(): Array<string>
  static push(s: string): void;
}

declare class FileDescriptor {
  // new(public file: File, public id: u32, public offset: u32);

  write(bytes: Array<u8>): void;

  writeString(str: string): void;

  copyByte(ptr: usize): void;

  writeByte(byte: u8): void;

  read(bytes: Array<u8>): void;

  readByte(): u8;

  pread(bytes: Array<u8>): void;

  readString(): string;


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

declare class Filesystem {
  files: Map<fd, FileDescriptor>;
  paths: Map<path, File>;

  static Default(): Filesystem;

  set(fd: fd, FD: FileDescriptor): void;

  get(fd: fd): FileDescriptor;

  open(path: path): fd;

  write(fd: fd, data: Array<u8>): void;

  read(fd: fd, data: Array<u8>): void;

  readString(fd: fd, offset?: usize): string;

  writeString(fd: fd, data: string): void;

  close(fd: number): void;

  readLine(fd: number, max?: usize): string;
}

declare var fs: Filesystem;
