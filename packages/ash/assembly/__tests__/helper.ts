import { Wasi } from '../../../assemblyscript/assembly/wasi';
import { JSON } from '../../../assemblyscript/assembly/json';
import * as path from '../../../assemblyscript/assembly/wasa/mock/path';
import { fs_str } from "./simple_fs";

beforeAll(() => {
    init();
})


export function init(): void {
    fs.init();
}


export function createFile(path: string): FileDescriptor {
    let FD = fs.createFile(path)
    if (FD.failed) {
        abort(Wasi.errno.toString(FD.error));
    }
    return FD.result;
}

export function testFile(): FileDescriptor {
    let fd = createFile("/test2");
    for (let i: i32 = 0; i < 20; i++) {
        fd.writeString("Hello World\n");
    }
    fd.reset();
    return fd;
}


