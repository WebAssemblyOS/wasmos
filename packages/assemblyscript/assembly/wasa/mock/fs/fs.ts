import { WasiResult } from '../..';
import { Wasi } from '../../../wasi';
import { hasFlag } from '../../../flag';
import { StringUtils } from '..';
import * as path from "../path";
export type fd = usize;



//@ts-ignore
@global
export class FileDescriptor {
    private stat: Wasi.fdstat;

    constructor(public fd: fd, public file: File | null, public offset: usize = 0) { }

    write(bytes: Array<u8>): Wasi.errno {
        if (bytes.length + this.offset > this.length) {
            return Wasi.errno.NOMEM
        }
        memory.copy(this.data + this.offset, bytes.buffer_.data, bytes.length)
        this.offset += bytes.length;
        return Wasi.errno.SUCCESS;
    }

    writeString(str: string, newline: boolean = false): Wasi.errno {
        // TODO: Add error checking
        let _str = str + (newline ? "\n" : "");
        if (_str.lengthUTF8 as usize + this.offset > this.length) {
            return Wasi.errno.NOMEM
        }
        memory.copy(this.data + this.offset, _str.toUTF8(), _str.lengthUTF8);
        this.offset += str.lengthUTF8 + 1;
        return Wasi.errno.SUCCESS;
    }

    read(bytes: Array<u8>): Wasi.errno {
        if (!this.hasSpace(bytes)) {
            return Wasi.errno.NOMEM;
        }
        memory.copy(bytes.buffer_.data, this.data + this.offset, bytes.length);
        return Wasi.errno.SUCCESS;
    }

    readByte(): WasiResult<u8> {
        if (this.offset + 1 >= this.length) {
            return WasiResult.fail<u8>(Wasi.errno.NOMEM);
        }
        return WasiResult.resolve<u8>(load<u8>(this.data + this.offset++));
    }

    pread(bytes: Array<u8>): Wasi.errno {
        let offset = this.offset;
        this.read(bytes);
        this.offset = offset;
        return Wasi.errno.SUCCESS;
    }

    readString(max: usize = 4096): WasiResult<string> {
        let str = StringUtils.fromCString(this.data + this.offset, this.length - this.offset);
        if (str == null) {
            return WasiResult.fail<string>(Wasi.errno.NOMEM)
        }
        this.offset += str.lengthUTF8 + 1; //For null character
        return WasiResult.resolve<string>(str);
    }

    readLine(): WasiResult<string> {
        let str = StringUtils.fromCStringTilNewLine(this.data + this.offset, this.length - this.offset);
        if (str == null) {
            return WasiResult.fail<string>(Wasi.errno.NOMEM)
        }
        this.offset += str.lengthUTF8 + 1; //For null character
        return WasiResult.resolve<string>(str);
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
    seek(offset: Wasi.filedelta, whence: Wasi.whence = Wasi.whence.CUR): WasiResult<usize> {
        let newOffset: usize = 0;
        switch (whence) {
            case Wasi.whence.CUR: {
                newOffset = <usize>(this.offset + offset);
                break;
            }
            case Wasi.whence.END: {
                newOffset = <usize>(this.length - <u64>Math.abs(<f64>offset));
                break;
            }
            case Wasi.whence.SET: {
                newOffset = <usize>Math.abs(<f64>offset);
                break;
            }
            default: {
                return WasiResult.fail<usize>(Wasi.errno.INVAL)
            }
        }
        this.offset = newOffset;
        return WasiResult.resolve<usize>(newOffset);
    }

    private get length(): usize {
        return (this.file != null) ? this.file.length : 0
    }

    private get data(): usize {
        return (this.file != null) ? this.file.data : 0;
    }

    tell(): u32 {
        return this.offset;
    }

    /**
     * Pointer to the fd field in memory
     */
    private get ptr(): usize {
        return changetype<usize>(this) + offsetof<FileDescriptor>("fd");
    }

    erase(): Wasi.errno {
        //TODO: Make return error type
        return this.file!.erase()
    }

    private hasSpace(bytes: Array<u8>): bool {
        return this.offset + bytes.length < this.length;
    }
}

export class DirectoryDescriptor extends FileDescriptor {

    get directory(): Directory {
        return this.file as Directory;
    }

    get children(): File[] {
        return this.directory.children;
    }

    listDir(): File[] {
        return this.children;
    }
}

export class File {
    private _data: ArrayBuffer;
    static DefaultSize: u32 = 1024;
    constructor(public path: string, public type: Wasi.filetype = Wasi.filetype.REGULAR_FILE) {
        this._data = new ArrayBuffer(File.DefaultSize);
    }
    /**
     * 
     * @param type File Type see Wasi.filetype
     * @param path Path
     * @param dirfd 
     */
    static create(type: Wasi.filetype, path: string, dirfd: fd, options: Wasi.oflags): File {
        switch (type) {
            case Wasi.filetype.DIRECTORY: {
                return new Directory(path)
            }
        }
        return new File(path);
    }


    get data(): usize {
        return this._data.data;
    }

    grow(): File {
        let newData = new ArrayBuffer(this._data.byteLength * 2);
        memory.copy(newData.data, this.data, this._data.byteLength);
        return this;
    }

    erase(): Wasi.errno {
        this._data = new ArrayBuffer(File.DefaultSize);
        return Wasi.errno.SUCCESS;
    }

    get length(): usize {
        return this._data.byteLength;
    }


    stat: Wasi.filestat
}

class Directory extends File {
    parent: Directory;
    children: Array<File>;
    constructor(path: string) {
        super(path, Wasi.filetype.DIRECTORY)
        this.parent = this;
        this.children = new Array<File>()
    }

}


export class FileSystem {
    readonly files: Map<fd, FileDescriptor> = new Map<fd, FileDescriptor>();
    readonly paths: Map<string, File> = new Map<string, File>();
    readonly highestFD: fd = 77;
    private lastFD: fd = this.highestFD;
    private _cwd: DirectoryDescriptor;


    init(): void {
        this.paths.set("/", new Directory("/"));
        this.cwd = this.openDirectory("/").result.fd;
        this.createDirectory("/dev")
        this.createDirectory("/dev/fd")
    }

    get cwd(): fd {
        return this._cwd.fd
    }

    set cwd(cwd: fd) {
        this._cwd = this.getDir(cwd).result;
    }

    static Default(): FileSystem {
        return new FileSystem();
    }

    set(fd: fd, FD: FileDescriptor): void {
        this.files.set(fd, FD);
    }

    get(fd: fd): WasiResult<FileDescriptor> {
        if (!this.files.has(fd) || fd <= Wasi.errno.NOTCAPABLE) return WasiResult.fail<FileDescriptor>(Wasi.errno.BADF);
        return WasiResult.resolve<FileDescriptor>(this.files.get(fd));
    }

    getDir(fd: fd): WasiResult<DirectoryDescriptor> {
        return this.get(fd) as WasiResult<DirectoryDescriptor>;
    }

    private _open(_path: string, type: Wasi.filetype, dirfd: fd, options: Wasi.oflags = 0): WasiResult<FileDescriptor> {
        let fullPath: string = this.fullPath(_path, dirfd);
        let parent: Directory;
        let parentName = path.dirname(fullPath);
        if (!this.paths.has(parentName)) {
            return WasiResult.fail<FileDescriptor>(Wasi.errno.NOENT);
        }
        parent = this.paths.get(parentName) as Directory;
        if (!this.paths.has(fullPath)) {
            if (hasFlag(options, Wasi.oflags.CREAT)) {
                this.paths.set(fullPath, File.create(type, fullPath, dirfd, options));
            } else {
                return WasiResult.fail<FileDescriptor>(Wasi.errno.NOENT);
            }
        }
        let fd = this.freshfd();
        let file: File = this.paths.get(fullPath);
        switch (type) {
            case Wasi.filetype.REGULAR_FILE: {
                if (file.type != type) {
                    return WasiResult.fail<FileDescriptor>(Wasi.errno.ISDIR)
                }
                this.set(fd, new FileDescriptor(fd, file));
                break;
            }
            case Wasi.filetype.DIRECTORY: {
                if (file.type != type) {
                    return WasiResult.fail<FileDescriptor>(Wasi.errno.NOTDIR)
                }
                let dir = new DirectoryDescriptor(fd, file)
                this.set(fd, dir)
            }
        }
        if (parent != null) {
            parent.children.push(file)
            if (type == Wasi.filetype.DIRECTORY) {
                (file as Directory).parent = parent!;
            }

        }
        return this.get(fd);
    }

    openAt(dirfd: fd, path: string, type: Wasi.filetype, options: Wasi.oflags = 0): WasiResult<FileDescriptor> {
        return this._open(path, type, dirfd, options);
    }

    open(path: string, type: Wasi.filetype, options?: Wasi.oflags): WasiResult<FileDescriptor> {
        return this.openAt(this.cwd, path, type, options)
    }

    openFileAt(dirfd: fd, path: string, options: Wasi.oflags = 0): WasiResult<FileDescriptor> {
        return this.openAt(dirfd, path, Wasi.filetype.REGULAR_FILE, options);
    }

    openFile(path: string, options: Wasi.oflags = Wasi.oflags.CREAT): WasiResult<FileDescriptor> {
        return this.openFileAt(this.cwd, path);
    }

    openDirectoryAt(dirfd: fd, path: string, create: boolean = false): WasiResult<DirectoryDescriptor> {
        return this.openAt(dirfd, path, Wasi.filetype.DIRECTORY, Wasi.oflags.DIRECTORY | (create ? Wasi.oflags.CREAT : 0)) as WasiResult<DirectoryDescriptor>;
    }

    createDirectoryAt(dirfd: fd, path: string): WasiResult<DirectoryDescriptor> {
        return this.openDirectoryAt(dirfd, path, true);
    }

    createFile(path: string): WasiResult<FileDescriptor> {
        return this.createFileAt(this.cwd, path);
    }

    createFileAt(dirfd: fd, path: string): WasiResult<FileDescriptor> {
        return this.openAt(dirfd, path, Wasi.filetype.REGULAR_FILE, Wasi.oflags.CREAT);
    }

    openDirectory(path: string, create: boolean = false): WasiResult<DirectoryDescriptor> {
        return this.openDirectoryAt(this.cwd, path, create);
    }

    createDirectory(path: string): WasiResult<DirectoryDescriptor> {
        return this.createDirectoryAt(this.cwd, path);
    }

    write(fd: fd, data: Array<u8>): Wasi.errno {
        let res = this.get(fd)
        if (res.failed) {
            return res.error;

        }
        return res.result.write(data);

    }

    read(fd: fd, data: Array<u8>): Wasi.errno {
        let res = this.get(fd);
        if (res.failed) {
            return res.error;
        }
        return res.result.read(data);
    }

    readString(fd: fd, offset: usize = 0): WasiResult<string> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<string>(res.error);
        }
        return res.result.readString();
    }

    readline(fd: fd, max?: usize): WasiResult<string> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<string>(res.error);
        }
        return res.result.readLine();
    }

    writeString(fd: fd, data: string, newline: boolean): Wasi.errno {
        let res = this.get(fd);
        if (res.failed) {
            return res.error;
        }
        return res.result.writeString(data, newline);
    }

    close(fd: fd): void {
        this.files.delete(fd);
    }

    erase(fd: fd): WasiResult<void> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<void>(res.error);
        }
        return WasiResult.void(this.get(fd).result.erase());
    }

    delete(path: string, type: Wasi.filetype = Wasi.filetype.REGULAR_FILE): WasiResult<void> {
        if (!this.paths.has(path)) {
            return WasiResult.void(Wasi.errno.NOENT);
        }
        if (this.paths.get(path).type != type) {
            switch (type) {
                case Wasi.filetype.DIRECTORY: return WasiResult.fail<void>(Wasi.errno.NOTDIR);
                case Wasi.filetype.REGULAR_FILE: return WasiResult.fail<void>(Wasi.errno.ISDIR);
                default: return WasiResult.fail<void>(Wasi.errno.NOENT);
            }
        }
        this.paths.delete(path);
        return WasiResult.fail<void>(Wasi.errno.SUCCESS)
    }

    deleteDirectory(path: string): WasiResult<void> {
        if (this.paths.get(path).type != Wasi.filetype.DIRECTORY) {
            return WasiResult.void(Wasi.errno.NOTDIR);
        }
        return this.delete(path, Wasi.filetype.DIRECTORY);
    }

    seek(fd: fd, offset: Wasi.filedelta, whence: Wasi.whence = Wasi.whence.CUR): WasiResult<usize> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<usize>(res.error);
        }
        return res.result.seek(offset, whence);
    }

    tell(fd: fd): WasiResult<usize> {
        return this.seek(fd, 0);
    }

    fullPath(_path: string, dirfd: fd = this.cwd): string {
        if (!path.isAbsolute(_path)) {
            return path.join([this.dirfdPath(dirfd), _path]);
        }
        return _path;
    }

    dirfdPath(dirfd: fd): string {
        return this.get(dirfd).result.file!.path;
    }

    listdir(fd: fd, dirfd: fd = this.cwd): WasiResult<Array<File>> {
        let dir = this.get(fd) as WasiResult<DirectoryDescriptor>
        if (dir.failed) {
            return WasiResult.fail<Array<File>>(dir.error)
        }
        return WasiResult.resolve<Array<File>>(dir.result.children);

    }

    private freshfd(): fd {
        return this.lastFD++;
    }
}


