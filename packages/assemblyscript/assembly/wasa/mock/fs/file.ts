

import { Inode } from "./inode";

export class File extends Inode {
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