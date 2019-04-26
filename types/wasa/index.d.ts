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
  static stderr: fd;
  static stdin: fd;
}


declare class CommandLine {
  static all(): Array<string>
  static push(s: string): void;
  static reset(): void;
}

declare class Process {
  static cwd: fd;
  static exit(err: usize): void;
}



declare class fs {

  /**
   * A simplified interface to open a file for read operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForRead(path: string, dirfd?: fd): fd;

  /**
   * A simplified interface to open a file for write operations
   * @param path Path
   * @param dirfd Base directory descriptor (will be automatically set soon)
   */
  static openForWrite(path: string, dirfd?: fd): fd;

  static openDirectory(path: string): fd;

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
  static write(fd: fd, data: Array<u8>): void;

  /**
   * Write a string to a file descriptor, after encoding it to UTF8
   * @param fd file descriptor
   * @param s string
   * @param newline `true` to add a newline after the string
   */
  static writeString(fd: fd, s: string, newline?: bool): void;

  /**
   * Write a string to a file descriptor, after encoding it to UTF8, with a newline
   * @param fd file descriptor
   * @param s string
   */
  static writeStringLn(fd: fd, s: string): void;

  /**
   * Read data from a file descriptor
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static read(
    fd: fd,
    data?: Array<u8>,
    chunk_size?: usize
  ): Array<u8> | null;

  /**
   * Read from a file descriptor until the end of the stream
   * @param fd file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  static readAll(
    fd: fd,
    data?: Array<u8>,
    chunk_size?: usize
  ): Array<u8> | null;

  /**
   * Read an UTF8 string from a file descriptor, convert it to a native string
   * @param fd file descriptor
   * @param chunk_size chunk size (default: 4096)
   */
  static readString(fd: fd, chunk_size?: usize): string;

  /**
   * Reach an UTF8 String from a file descriptor until a new line is reached.
   */
  static readLine(fd: fd, chunk_size?: usize): string;

  static reset(fd: fd): void;

  static erase(fd: fd): void;

  /**
   * 
   * @param fd File Descriptor
   * Returns the current offset of the file descriptor
   */
  static tell(fd: fd): usize;
}