/**
 * Helper class for dealing with errors.
 */
declare class WasiResult<T> {
  constructor(first: T | null, second?: Wasi.errno);
  /**
 * Tests if the error is not a success.
 */
  failed: boolean;
  error: Wasi.errno;
  result: T;
  /**
   * Passes value if system call was successful.
   * @param result - Value returned 
   */
  static resolve<T>(result: T): WasiResult<T>;
  /**
   * Called if an error was encountered.
   * @param err 
   */
  static fail<T>(err: Wasi.errno): WasiResult<T>;

  /**
   * Special case where there is no result type just the error.
   * @param res error
   */
  static void<T>(res: Wasi.errno): WasiResult<T>;
}

declare type fd = usize;
declare type path = string;

/**
 * Global console class to access std input/output streams.
 */
declare class Console {
  /**
   * Write a string to the console
   * @param s string
   * @param newline `false` by default to avoid inserting a newline after the string.
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

/**
 * Wrapper class for file descriptors.  
 * Tracks offset within a file and provides methods to read and write.
 */
declare class FileDescriptor {

  file: File | null;
  fd: u32;
  offset: u32;

  /**
   * Write an array of bytes to a file;
   */
  write(bytes: Array<u8>): Wasi.errno;

  /**
   * write string to file.
   * @str: string
   * newline: bool
   */
  writeString(str: string, newline?: bool): Wasi.errno;

  /**
   * Read data into byte array.
   */
  read(bytes: Array<u8>): Wasi.errno;

  /**
   * Read data into byte array without moving the offset.
   */
  pread(bytes: Array<u8>): Wasi.errno;

  /**
   * read string from file.
   */
  readString(): WasiResult<string>;

  /**
   * Read byte from file.
   */
  readByte(): WasiResult<u8>;

  /**
   * Read a string up until a new line.
   */
  readLine(): WasiResult<string>;

  /**
   * Current offset within the file
   */
  tell(): u32;

  /**
   * Resets the offset to 0
   */
  reset(): void;

  /**
   * set seek (offset) relative to whence.
   * whence can be:
   * - Wasi.whence.CUR - Current offset
   * - Wasi.whence.END - End of file
   * - Wasi.whence.SET - Start of file
   */
  seek(offset: Wasi.filedelta, whence?: Wasi.whence): WasiResult<usize>;

  /**
   * Removes all data from the file
   */
  erase(): Wasi.errno
}

declare class File {
  static DefaultSize: u32;
  data: usize;
  grow(): File;
}


declare class Directory extends File {
  /**
   * Reference to parent directory.
   */
  parent: Directory;
  /**
   * Array of Files contained in directory.
   */
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
  /**
   * Creates a new file and returning its new File Descriptor
   * @param path 
   */
  static createFile(path: string): WasiResult<FileDescriptor>;
  /**
   * 
   * @param dirfd base Directory
   * @param path 
   */
  static createFileAt(dirfd: fd, path: string): WasiResult<FileDescriptor>;
  /**
   * Open file relative to the cwd if not absolute.
   * @param path 
   * @param options optional, default Wasi.oflags.CREAT
   */
  static openFile(path: string, options?: Wasi.oflags): WasiResult<FileDescriptor>;

  static openFileAt(dirfd: fd, path: string, options?: Wasi.oflags): WasiResult<FileDescriptor>;

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

  /**
   * Equivalent to seek(fd, 0 Wasi.whence.SET) or reseting the offset to 0
   * @param fd file descriptor
   */
  static reset(fd: fd): void;
  /**
   *
   * @param fd File fd
   * returns the current offset of the file descriptor
   */
  static tell(fd: fd): WasiResult<usize>;

  /**
   *
   * @param fd File fd
   * @param offset The number of bytes to move
   * @param whence The base from which the offset is relative
   */
  static seek(fd: fd, offset: Wasi.filedelta, whence?: Wasi.whence): WasiResult<usize>;

  static get(fd: fd): WasiResult<FileDescriptor>;

  static erase(fd: fd): WasiResult<void>;

  static listdir(fd: fd): WasiResult<Array<File>>;

  static delete(path: string): WasiResult<void>;

  static deleteDirectory(path: string): WasiResult<void>;


}


declare class Process {
  static exit(code: number): void;
}
