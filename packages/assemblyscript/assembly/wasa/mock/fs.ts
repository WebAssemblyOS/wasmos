import { StringUtils } from ".";

type path = string;
type fd = usize;

export class FileDescriptor {
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
    this.seek(0);
  }

  /**
   * set seek (offset)
   */
  seek(offset: usize): void {
    this.offset = offset
  }

  get data(): usize {
    return this.file.data;
  }
}

export class Stdout extends FileDescriptor {
  constructor(file: File) {
    super(file, 1, 0);
  }
}

export class File {
  private _data: ArrayBuffer;
  static DefaultSize: u32 = 1024;
  constructor(public path: string) {
    this._data = new ArrayBuffer(File.DefaultSize);
  }
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
}

class Directory extends File {
  parent: Directory;
  children: Array<File>;
}



export class Filesystem {
  files: Map<fd, FileDescriptor> = new Map<fd, FileDescriptor>();
  paths: Map<path, File> = new Map<path, File>();
  highestFD: usize = 0;
  pwd: fd;

  static Default(): Filesystem {
    let fs = new Filesystem();
    fs.pwd = fs.openDirectory("/")
    fs.openFile("/dev/fd/0")
    fs.openFile("/dev/fd/1")
    fs.openFile("/dev/fd/2")
    return fs;
  }

  set(fd: fd, FD: FileDescriptor): void {
    this.files.set(fd, FD);
  }

  get(fd: fd): FileDescriptor {
    return this.files.get(fd);
  }

  openFile(path: path): fd {
    let fd = this.highestFD++;
    if (!this.paths.has(path)) {
      this.paths.set(path, new File(path));
    }
    this.set(fd, new FileDescriptor(this.paths.get(path), fd, 0));
    return fd;
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
  close(fd: number): void {
    this.files.delete(fd);
  }
  openDirectory(path: string): fd {
    // this.open()
    return 0;
  }
}
