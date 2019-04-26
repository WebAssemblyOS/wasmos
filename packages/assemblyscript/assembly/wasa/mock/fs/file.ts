

import { Inode, wasi } from "./inode";

export class File extends Inode {
    constructor(public path: string) {
        super(path);
        this._stat.filetype = 
    }


}