import { Wasi, WasiResult } from "../../wasi";
import { hasFlag } from '../../flag';
import { StringUtils, Buffer } from '../utils';
import * as path from "../path";
import { fd_write, fd_close, fd_read } from 'bindings/wasi';
import { fd_pread, fd_tell, path_open, fd_readdir, filestat, fd_filestat_get, dirent } from '../../std/bindings/wasi_unstable';
export type fd = usize;

function failed(errno: Wasi.errno): bool {
    return errno != Wasi.errno.SUCCESS;
}

//@ts-ignore
@global
export class FileDescriptor {

    constructor(public fd: fd, public file: File | null = null, public offset: usize = 0) { }

    /**
     * Close a file descriptor
     * @param fd file descriptor
     */
    close(): void {
        fd_close(this.fd);
    }

    /**
     * Write data to a file descriptor
     * @param fd file descriptor
     * @param data data
     */
    write(data: Array<u8>): Wasi.errno {
        let data_buf_len = data.length;
        let data_buf = memory.allocate(data_buf_len);
        for (let i = 0; i < data_buf_len; i++) {
            store<u8>(data_buf + i, unchecked(data[i]));
        }
        let iov = memory.allocate(2 * sizeof<usize>());
        store<u32>(iov, data_buf);
        store<u32>(iov + sizeof<usize>(), data_buf_len);
        let written_ptr = memory.allocate(sizeof<usize>());
        let errno = fd_write(this.fd, iov, 1, written_ptr);
        memory.free(written_ptr);
        memory.free(data_buf);
        return errno;
    }

    /**
     * Write a string to a file descriptor, after encoding it to UTF8
     * @param fd file descriptor
     * @param s string
     * @param newline `true` to add a newline after the string
     */
    writeString(s: string, newline: bool = false): Wasi.errno {
        if (newline) {
            return this.writeStringLn(s);
        }
        let s_utf8_len: usize = s.lengthUTF8 - 1;
        let s_utf8 = s.toUTF8();
        let iov = memory.allocate(2 * sizeof<usize>());
        store<u32>(iov, s_utf8);
        store<u32>(iov + sizeof<usize>(), s_utf8_len);
        let written_ptr = memory.allocate(sizeof<usize>());
        let errno = fd_write(this.fd, iov, 1, written_ptr);
        memory.free(written_ptr);
        memory.free(s_utf8);
        return errno;
    }

    /**
     * Write a string to a file descriptor, after encoding it to UTF8, with a newline
     * @param fd file descriptor
     * @param s string
     */
    writeStringLn(s: string): Wasi.errno {
        let s_utf8_len: usize = s.lengthUTF8 - 1;
        let s_utf8 = s.toUTF8();
        let iov = memory.allocate(4 * sizeof<usize>());
        store<u32>(iov, s_utf8);
        store<u32>(iov + sizeof<usize>(), s_utf8_len);
        let lf = memory.allocate(1);
        store<u8>(lf, 10);
        store<u32>(iov + sizeof<usize>() * 2, lf);
        store<u32>(iov + sizeof<usize>() * 3, 1);
        let written_ptr = memory.allocate(sizeof<usize>());
        let errno = fd_write(this.fd, iov, 2, written_ptr);
        memory.free(written_ptr);
        memory.free(s_utf8);
        return errno;
    }

    /**
     * Read data from a file descriptor
     * @param fd file descriptor
     * @param data existing array to push data to
     * @param chunk_size chunk size (default: 4096)
     */
    read(data: Array<u8> = [], chunk_size: usize = 4096, pread: boolean = false): WasiResult<Array<u8>> {
        let data_partial_len = chunk_size;
        let data_partial = memory.allocate(data_partial_len);
        let iov = memory.allocate(2 * sizeof<usize>());
        store<u32>(iov, data_partial);
        store<u32>(iov + sizeof<usize>(), data_partial_len);
        let read_ptr = memory.allocate(sizeof<usize>());
        let errno: Wasi.errno;
        if (pread) {
            let tell = this.tell();
            if (tell.failed) {
                return WasiResult.fail<Array<u8>>(tell.error);
            }
            errno = fd_pread(this.fd, iov, 1, this.offset, read_ptr);
        } else {
            errno = fd_read(this.fd, iov, 1, read_ptr);
        }
        let read: usize = 0;
        if (!failed(errno)) {
            read = load<usize>(read_ptr);
            if (read > 0) {
                for (let i: usize = 0; i < read; i++) {
                    data.push(load<u8>(data_partial + i));
                }
            }
        }
        memory.free(read_ptr);
        memory.free(data_partial);
        if (failed(errno)) {
            return WasiResult.fail<Array<u8>>(errno);
        }

        if (read < 0) {
            return WasiResult.fail<Array<u8>>(Wasi.errno.BADF);
        }
        return WasiResult.resolve<Array<u8>>(data);
    }

    /**
     * Read from a file descriptor until the end of the stream
     * @param fd file descriptor
     * @param data existing array to push data to
     * @param chunk_size chunk size (default: 4096)
     */
    readAll(data: Array<u8> = [], chunk_size: usize = 4096): WasiResult<Array<u8>> {
        let data_partial_len = chunk_size;
        let data_partial = memory.allocate(data_partial_len);
        let iov = memory.allocate(2 * sizeof<usize>());
        store<u32>(iov, data_partial);
        store<u32>(iov + sizeof<usize>(), data_partial_len);
        let read_ptr = memory.allocate(sizeof<usize>());
        let read: usize = 0;
        for (; ;) {
            let errno = fd_read(this.fd, iov, 1, read_ptr)
            if (errno != Wasi.errno.SUCCESS) {
                if (errno == Wasi.errno.NOENT) {
                    memory.free(read_ptr);
                    memory.free(data_partial);
                    return WasiResult.fail<Array<u8>>(errno)
                }
                break;
            }
            read = load<usize>(read_ptr);
            if (read <= 0) {
                break;
            }
            for (let i: usize = 0; i < read; i++) {
                data.push(load<u8>(data_partial + i));
            }
        }
        memory.free(read_ptr);
        memory.free(data_partial);

        if (read < 0) {
            return WasiResult.fail<Array<u8>>(Wasi.errno.BADF);
        }
        return WasiResult.resolve<Array<u8>>(data);
    }

    /**
     * Read an UTF8 string from a file descriptor, convert it to a native string
     * @param fd file descriptor
     * @param chunk_size chunk size (default: 4096)
     */
    readString(chunk_size: usize = 4096): WasiResult<string> {
        let s_utf8_ = this.readAll([], chunk_size);
        if (s_utf8_.failed) {
            return WasiResult.fail<string>(s_utf8_.error);
        }
        let s_utf8 = s_utf8_.result;
        let s_utf8_len = s_utf8.length;
        let s_utf8_buf = memory.allocate(s_utf8_len);
        for (let i = 0; i < s_utf8_len; i++) {
            store<u8>(s_utf8_buf + i, s_utf8[i]);
        }
        let s = String.fromUTF8(s_utf8_buf, s_utf8.length);
        memory.free(s_utf8_buf);

        return WasiResult.resolve<string>(s);
    }


    pread(data: Array<u8> = [], chunk_size: usize = 4096): WasiResult<Array<u8>> {
        return this.read(data, chunk_size, true);
    }

    readLine(max: usize = 4096): WasiResult<string> {
        let _max = <usize>Math.min(max, this.size - this.offset + 1); //Conut the EOT character
        let str = StringUtils.fromCStringTilNewLine(this.data + this.offset, _max);
        if (str == null) {
            return WasiResult.fail<string>(Wasi.errno.NOMEM)
        }
        this.offset += str.lengthUTF8 - 1;
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
        return WasiResult.resolve<usize>(newOffset);
    }

    private get length(): usize {
        return (this.file != null) ? this.file.length : 0
    }

    private get data(): usize {
        return (this.file != null) ? this.file.data : 0;
    }

    tell(): WasiResult<void> {
        let errno = fd_tell(this.fd, this._offset)
        return WasiResult.void(errno);
    }


    /**
     * Pointer to the fd field in memory
     */
    private get ptr(): usize {
        return changetype<usize>(this) + offsetof<FileDescriptor>("fd");
    }

    /**
     * Pointer offset field in memory
     */
    private get _offset(): usize {
        return changetype<usize>(this) + offsetof<FileDescriptor>("offset");
    }

    erase(): Wasi.errno {
        //TODO: Make return error type
        let errno = this.file!.erase()
        if (errno == Wasi.errno.SUCCESS) {
            this.reset();
        }
        return errno;
    }

    private hasSpace(bytes: Array<u8>): bool {
        return this.offset + bytes.length < this.length;
    }

    grow(amount?: usize): Wasi.errno {
        let length = this.file!.length;
        this.file!.grow(amount)
        if (this.file!.length > length) {
            return Wasi.errno.SUCCESS;
        }
        return Wasi.errno.NOMEM;
    }

    get size(): usize {
        return this.file!.size;
    }

}
// //@ts-ignore
// @inline
// function ptr<T>(t: T, field: string): usize {
//     return changetype<usize>(t) + offsetof<T>(field);
// }

export class Dirent {
    get name(): string {
        return String.fromUTF8(this.namePtr, this.namlen)
    }

    get namlen(): usize {
        let ptr = changetype<usize>(this) + offsetof<dirent>("namlen");
        return load<usize>(ptr);
    }

    get namePtr(): usize {
        return changetype<usize>(this) + offsetof<dirent>();
    }

    get next(): usize {
        return load<usize>(changetype<usize>(this));
    }

    get nextEntry(): usize {
        let ptr = this.namlen + this.namePtr;
        return ptr;
    }

    get type(): Wasi.filetype {
        let ptr = changetype<usize>(this) + offsetof<dirent>("type");
        return load<Wasi.filetype>(ptr);
    }

    get ino(): Wasi.inode {
        let ptr = changetype<usize>(this) + offsetof<dirent>("ino");
        return load<Wasi.filetype>(ptr);
    }


}

export class DirectoryDescriptor extends FileDescriptor {
    stat: filestat = new filestat();
    entries: Buffer<Dirent>
    buf_used: usize
    get directory(): Directory {
        return this.file as Directory;
    }

    get children(): File[] {
        return this.directory.children;
    }
    //TODO
    firstEntry(): WasiResult<DirectoryEntry[]> {
        this.entries = new Buffer<Dirent>(2048);
        let res = fd_readdir(this.fd, this.entries.ptr, this.entries.length, 0, this.buf_used_ptr);
        if (failed(res)) {
            return WasiResult.fail<DirectoryEntry[]>(res);
        }
        let entries = new Array<DirectoryEntry>();
        for (let i: usize = this.entries.ptr; i < this.buf_used + this.entries.ptr;) {
            let dirent = changetype<Dirent>(i);
            entries.push(new DirectoryEntry(dirent.next, dirent.name, dirent.type, dirent.ino));
            i = dirent.nextEntry;
        }

        return WasiResult.resolve<DirectoryEntry[]>(entries);
    }

    listDir(): WasiResult<DirectoryEntry[]> {

        let res: DirectoryEntry[] = [];
        return WasiResult.resolve<DirectoryEntry[]>(res);
    }

    get parent(): string {
        return this.directory.parent.path;
    }

    get buf_used_ptr(): usize {
        return changetype<usize>(this) + offsetof<DirectoryDescriptor>("buf_used");
    }
    get stat_ptr(): usize {
        return changetype<usize>(this) + offsetof<DirectoryDescriptor>("stat");
    }
}

export class File {
    private _data: ArrayBuffer;
    static readonly DefaultSize: u32 = 1024;
    size: usize = 0;

    constructor(public path: string, public type: Wasi.filetype = Wasi.filetype.REGULAR_FILE) {
        this._data = new ArrayBuffer(File.DefaultSize);
        this.writeEOT(0);
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

    grow(amount: usize = this._data.byteLength * 2): File {
        let newData = new ArrayBuffer(amount);
        memory.copy(newData.data, this.data, this._data.byteLength);
        return this;
    }

    erase(): Wasi.errno {
        this._data = new ArrayBuffer(File.DefaultSize);
        this.size = 0;
        this.writeEOT(0);
        return Wasi.errno.SUCCESS;
    }

    get length(): usize {
        return this._data.byteLength;
    }

    writeEOT(offset: usize): Wasi.errno {
        return this.writeByte(offset, StringUtils.EOT);
    }

    writeByte(offset: usize, byte: u8): Wasi.errno {
        if (offset >= this.length) {
            return Wasi.errno.NOMEM;
        }
        store<u8>(this.data + offset, byte);
        return Wasi.errno.SUCCESS;
    }

    writeBytes(offset: usize, ptr: usize, size: usize): Wasi.errno {
        if (offset + size >= this.length) {
            return Wasi.errno.NOMEM;
        }
        let dst = offset + this.data;
        memory.copy(dst, ptr, size);
        if (offset + size > this.size) {
            this.size = offset + size;
            this.writeEOT(this.size);
        }
        return Wasi.errno.SUCCESS;
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

class DirectoryEntry {
    constructor(public next: Wasi.dircookie, public path: string, public type: Wasi.filetype, public inode: Wasi.inode) { }
}

//@ts-ignore
@global
export class FileSystem {
    readonly files: Map<fd, FileDescriptor> = new Map<fd, FileDescriptor>();
    readonly paths: Map<string, File> = new Map<string, File>();
    readonly highestFD: fd = 77;
    private lastFD: fd = this.highestFD;
    private _cwd: DirectoryDescriptor;


    init(): void {
        // this.paths.set("/", new Directory("/"));
        this.files.set(3, new DirectoryDescriptor(3, null));// 3 is theh 
        // this.createDirectory("/dev")
        // this.createDirectory("/dev/fd")
    }

    get cwd(): fd {
        return 3
    }

    set cwd(cwd: fd) {
        // this._cwd = this.getDir(cwd).result;
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
        let fd_lookup_flags = Wasi.lookupflags.SYMLINK_FOLLOW;
        let fd_oflags: Wasi.oflags = 0;
        let fd_rights = Wasi.rights.DEFAULT;
        let fd_rights_inherited = fd_rights;
        let fd_flags: Wasi.fdflags = 0;
        let path_utf8_len: usize = _path.lengthUTF8 - 1;
        let path_utf8 = _path.toUTF8();
        let fd_buf = memory.allocate(sizeof<u32>());
        let res = path_open(dirfd, fd_lookup_flags, path_utf8, path_utf8_len,
            fd_oflags, fd_rights, fd_rights_inherited, fd_flags, fd_buf);
        if (res != Wasi.errno.SUCCESS) {
            //@ts-ignore
            abort(res.toString())
            return WasiResult.fail<FileDescriptor>(res);
        }
        let fd = load<u32>(fd_buf);
        memory.free(fd_buf);
        let FD = new FileDescriptor(fd, null);
        this.files.set(fd, FD);
        return WasiResult.resolve<FileDescriptor>(FD);
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

    read(fd: fd, data: Array<u8>): WasiResult<Array<u8>> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<Array<u8>>(res.error);
        }
        return res.result.read(data);
    }

    readString(fd: fd, max?: usize): WasiResult<string> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<string>(res.error);
        }
        return res.result.readString(max);
    }

    readline(fd: fd, max?: usize): WasiResult<string> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<string>(res.error);
        }
        return res.result.readLine(max);
    }

    writeString(fd: fd, data: string, newline: boolean): Wasi.errno {
        let res = this.get(fd);
        if (res.failed) {
            return res.error;
        }
        return res.result.writeString(data, newline);
    }

    close(fd: fd): Wasi.errno {
        if (!this.files.has(fd)) { return Wasi.errno.BADF; }
        return this.files.delete(fd) ? Wasi.errno.SUCCESS : Wasi.errno.BADF;
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

    private dirfdPath(dirfd: fd): string {
        return this.get(dirfd).result.file!.path;
    }

    listdir(fd: fd, dirfd: fd = this.cwd): WasiResult<DirectoryEntry[]> {
        let dir = this.get(fd) as WasiResult<DirectoryDescriptor>
        if (dir.failed) {
            return WasiResult.fail<DirectoryEntry[]>(dir.error)
        }
        return dir.result.listDir();

    }

    private freshfd(): fd {
        return this.lastFD++;
    }

    grow(fd: fd, amount?: usize): WasiResult<void> {
        let res = this.get(fd);
        if (res.failed) {
            return WasiResult.fail<void>(res.error);
        }
        return WasiResult.void(res.result.grow(amount));
    }
}


