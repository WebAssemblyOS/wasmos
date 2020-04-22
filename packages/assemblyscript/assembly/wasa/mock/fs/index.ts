import { FileSystem, FileDescriptor, fd, DirectoryDescriptor } from "./fs";
import { WasiResult } from '../..';
import { Wasi } from "../../../wasi";
export * from "./fs";

let DefaultFS = FileSystem.Default();

const BASE_RIGHTS: Wasi.rights = Wasi.rights.FD_READ | Wasi.rights.FD_WRITE | Wasi.rights.FD_READDIR

// @ts-ignore decorator is valid
@global
export class fs {
    public static _fs: FileSystem = DefaultFS;
    private static initialized: bool = false;

    static set fs(_fs: FileSystem) {
        fs._fs = _fs;
    }

    static get fs(): FileSystem {
        if (!fs.initialized) {
            fs._fs.init();
            fs.initialized = true;
        }
        return fs._fs;
    }

    static get cwd(): fd {
        return fs.fs.cwd
    }

    static set cwd(dirfd: fd) {
        fs.fs.cwd = dirfd;
    }

    static init(): void {
        fs.fs;
    }

    /**
     * A simplified interface to open a file for read operations
     * @param path Path
     * @param dirfd Base directory descriptor (will be automatically set soon)
     */
    static openForRead(path: string, dirfd: fd = fs.fs.cwd): WasiResult<FileDescriptor> {
        return this.fs.openFileAt(dirfd, path);
    }

    static createFile(path: string): WasiResult<FileDescriptor> {
        return this.fs.createFile(path);
    }

    static createFileAt(dirfd: fd, path: string): WasiResult<FileDescriptor> {
        return this.fs.createFileAt(dirfd, path)
    }

    /**
     * A simplified interface to open a file for write operations
     * @param path Path
     * @param dirfd Base directory descriptor (will be automatically set soon)
     */
    static openForWrite(path: string, dirfd: fd = fs.fs.cwd): WasiResult<FileDescriptor> {
        return this.fs.openFileAt(dirfd, path);
    }


    static openFile(path: string, options: Wasi.oflags = 0): WasiResult<FileDescriptor> {
        return this.fs.openFile(path, options);
    }

    static openFileAt(dirfd: fd, path: string, options?: Wasi.oflags): WasiResult<FileDescriptor> {
        return this.fs.openFileAt(dirfd, path, options)
    }


    static open(path: string, type: Wasi.filetype, options: Wasi.oflags): WasiResult<FileDescriptor> {
        return this.fs.open(path, type, options);
    }

    /**
     * 
     * @param path path of new directory
     */
    static createDirectory(path: string): WasiResult<DirectoryDescriptor> {
        return this.fs.createDirectory(path);
    }

    static createDirectoryAt(dirfd: fd, path: string): WasiResult<DirectoryDescriptor> {
        return this.fs.createDirectoryAt(dirfd, path);
    }

    static openDirectory(path: string): WasiResult<DirectoryDescriptor> {
        return this.fs.openDirectory(path);
    }

    static openDirectoryAt(path: string, dirfd: fd): WasiResult<DirectoryDescriptor> {
        return this.fs.openDirectoryAt(dirfd, path)
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
        return this.fs.read(fd, data);
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
    static tell(fd: fd): WasiResult<usize> {
        return this.fs.tell(fd);
    }

    /**
     * 
     * @param fd File fd
     * @param offset The number of bytes to move
     * @param whence The base from which the offset is relative
     */
    static seek(fd: fd, offset: Wasi.filedelta, whence: Wasi.whence = Wasi.whence.CUR): WasiResult<usize> {
        return this.fs.seek(fd, offset, whence);
    }

    static get(fd: fd): WasiResult<FileDescriptor> {
        return this.fs.get(fd);
    }

    static getDir(fd: fd): WasiResult<DirectoryDescriptor> {
        return this.fs.getDir(fd);
    }

    static erase(fd: fd): WasiResult<void> {
        return this.fs.erase(fd);
    }

    static listdir(fd: fd): WasiResult<DirectoryEntry[]> {
        return this.fs.listdir(fd);
    }

    static delete(path: string): WasiResult<void> {
        return this.fs.delete(path);
    }

    static deleteDirectory(path: string): WasiResult<void> {
        return this.fs.deleteDirectory(path);
    }

    static grow(fd: fd, amount?: usize): WasiResult<void> {
        return this.fs.grow(fd, amount);
    }

}