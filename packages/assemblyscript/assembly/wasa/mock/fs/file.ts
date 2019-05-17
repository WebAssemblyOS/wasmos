

import { Inode } from "./inode";

export class File extends Inode {
    constructor(public path: string) {
        super(path);
        this._stat.filetype = Wasi.filetype.REGULAR_FILE;
    }


}