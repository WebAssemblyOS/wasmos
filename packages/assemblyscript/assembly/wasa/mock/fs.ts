import { StringUtils } from ".";
import { Wasi } from '../../../../kernel/src/wasi/wasi';

type path = string;
type fd = usize;

export class FileDescriptor {
  stat: Wasi.fdstat;

  constructor(public file: File, public id: u32, public offset: u32) { }

  write(bytes: Array<u8>): void {
    for (let i = 0; i < bytes.length; i++) {
      this.writeByte(bytes[i]);
    }
  }

  writeString(str: string): void {
    // TODO: std should expose memcpy?
    memory.copy(this.data + this.offset, str.toUTF8(), str.lengthUTF8);
    this.offset += str.lengthUTF8;
  }

  copyByte(ptr: usize): void {
    this.writeByte(load<u8>(ptr));
  }

  writeByte(byte: u8): void {
    store<u8>(this.file.data + this.offset++, byte);
  }

  read(bytes: Array<u8>): void {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = this.readByte();
    }
  }

  readByte(): u8 {
    return load<u8>(this.data + this.offset++);
  }

  pread(bytes: Array<u8>): void {
    let offset = this.offset;
    this.read(bytes);
    this.offset = offset;
  }

  readString(max: usize = 4096): string {
    let str = StringUtils.fromCString(this.data + this.offset, max);
    this.offset += str.lengthUTF8 + 1; //For null character
    return str;
  }

  readLine(max?: usize): string {
    let str = StringUtils.fromCStringTilNewLine(this.data + this.offset, max);
    this.offset += str.lengthUTF8 + 1; //For null character
    return str;
  }

  /**
   * Resets the offset to 0
   */
  reset(): void {
    this.seek(0, Wasi.whence.SET);
  }

  /**
   * set seek (offset)
   */
  seek(offset: Wasi.filedelta, whence: Wasi.whence = Wasi.whence.CUR): usize {
    let newOffset: usize = 0;
    switch (whence) {
      case Wasi.whence.CUR: {
        newOffset = <usize>(this.offset + offset);
        break;
      }
      case Wasi.whence.END: {
        newOffset = <usize>(this.file.length - Math.abs(offset));
        break;
      }
      case Wasi.whence.SET: {
        newOffset = <usize>Math.abs(offset);
        break;
      }
      default: {
        Process.exit(1)
      }
    }
    this.offset = newOffset;
    return newOffset
  }

  get data(): usize {
    return this.file.data;
  }
}

export class DirectoryDescriptor extends FileDescriptor {

  get directory(): Directory {
    return this.file as Directory;
  }

  get children(): File[] {
    return this.directory.children;
  }

  addFile(file: File): void {
    this.directory.children.push(file);
  }
}

export class File {
  constructor(public path: string) {
    this._data = new ArrayBuffer(File.DefaultSize);
  }
  /**
   * 
   * @param type File Type see Wasi.filetype
   * @param path Path
   * @param dirfd 
   */
  static create(type: Wasi.filetype, path: string, dirfd: fd): File {
    switch (type) {
      case Wasi.filetype.DIRECTORY: {
        return new Directory(path)
      }
    }
    return new File(path);
  }
  private _data: ArrayBuffer;
  static DefaultSize: u32 = 1024;

  get data(): usize {
    return this._data.data;
  }

  grow(): File {
    let newData = new ArrayBuffer(this._data.byteLength * 2);
    memory.copy(newData.data, this.data, this._data.byteLength);
    return this;
  }

  erase(): void {
    this._data = new ArrayBuffer(File.DefaultSize);
  }

  get length(): usize {
    return this._data.byteLength;
  }

  stat: Wasi.filestat
}

class Directory extends File {
  parent: Directory;
  children: Array<File>;
}



export class Filesystem {
  files: Map<fd, FileDescriptor> = new Map<fd, FileDescriptor>();
  paths: Map<path, File> = new Map<path, File>();
  highestFD: usize = 0;

  get cwd(): fd {
    return Process.cwd
  }

  static Default(): Filesystem {
    let fs = new Filesystem();
    return fs;
  }

  set(fd: fd, FD: FileDescriptor): void {
    this.files.set(fd, FD);
  }

  get(fd: fd): FileDescriptor {
    return this.files.get(fd);
  }

  private open(path: path, type: Wasi.filetype, dirfd: fd): fd {
    let fd = this.highestFD++;
    if (!this.paths.has(path)) {
      this.paths.set(path, File.create(type, path, fd));
    }
    this.set(fd, new FileDescriptor(this.paths.get(path), fd, 0));
    return fd;
  }

  openFile(dirfd: fd, path: path): fd {
    return this.open(path, Wasi.filetype.REGULAR_FILE, dirfd);
  }

  write(fd: fd, data: Array<u8>): void {
    this.get(fd).write(data);
  }

  read(fd: fd, data: Array<u8>): void {
    this.get(fd).read(data);
  }

  readString(fd: fd, offset: usize = 0): string {
    return this.get(fd).readString();
  }

  writeString(fd: fd, data: string): void {
    this.get(fd).writeString(data);
  }

  close(fd: fd): void {
    this.files.delete(fd);
  }

  openDirectory(dirfd: fd, path: string): fd {
    return this.open(path, Wasi.filetype.DIRECTORY, dirfd);
  }
  createDirectory(dirfd: fd, path: string): fd {
    return this.openDirectory(dirfd, path);
  }

  erase(fd: fd): void {
    this.get(fd).file.erase()
  }

}
