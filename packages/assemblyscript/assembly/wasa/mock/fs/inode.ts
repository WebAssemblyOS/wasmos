import * as Wasi from "../../../std/bindings/wasi";



export class Inode {
    constructor(public path: string) {
        this._data = new ArrayBuffer(Inode.DefaultSize);
        this._stat = new Wasi.filestat();

    }
    _data: ArrayBuffer
    _stat: Wasi.filestat
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

    /** Device ID of device containing the file. */
    get dev(): Wasi.device {
        return this._stat.dev;
    }
    /** File serial number. */
    get ino(): Wasi.inode {
        return this._stat.ino
    }
    /** File type. */
    get filetype(): Wasi.filetype {
        return Wasi.filetype.UNKNOWN
    }
    /** Number of hard links to the file. */
    get nlink(): Wasi.linkcount {
        return this._stat.nlink
    }
    /** For regular files, the file size in bytes. For symbolic links, the length in bytes of the pathname contained in the symbolic link. */
    get size(): Wasi.filesize {
        return this._data.byteLength;
    }
    /** Last data access timestamp. */
    get atim(): Wasi.timestamp {
        return this._stat.atim
    }
    /** Last data modification timestamp. */
    get mtim(): Wasi.timestamp {
        return this._stat.mtim
    }
    /** Last file status change timestamp. */
    get ctim(): Wasi.timestamp {
        return this._stat.ctim
    }


}