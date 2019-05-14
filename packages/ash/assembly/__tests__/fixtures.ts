import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs/fs';
import { Wasi } from '../../../assemblyscript/assembly/wasi';
import { JSON } from '../../../assemblyscript/assembly/json';
import * as path from '../../../assemblyscript/assembly/wasa/mock/path';

beforeAll(() => {
    fs.fs;
    Console.stdout;
    Console.stdin;
    Console.stderr;
})

export function openStdout(): FileDescriptor {
    return open("/dev/fd/1");
}

export function open(path: string): FileDescriptor {
    let FD = fs.createFile(path)
    if (FD.failed) {
        abort(Wasi.errno.toString(FD.error));
    }
    return FD.result;
}

export function createDirectory(path: string): FileDescriptor {
    let FD = fs.createDirectory(path)
    if (FD.failed) {
        abort(Wasi.errno.toString(FD.error));
    }
    return FD.result;
}

export function testFile(): FileDescriptor {
    let fd = open("/test");
    fd.writeString(Hello_World);
    fd.reset();
    return fd;
}

export function readString(FD: FileDescriptor): string {
    let res = FD.readString();
    if (res.failed) {
        abort(Wasi.errno.toString(res.error))
    }
    return res.result;
}

export function addJSONtoFS(str: string): void {
    let root = JSON.parse(str);
    toFS(root, "/")
}

function toFS(obj: JSON.Object, parent: string): void {
    let keys = obj.keys;
    for (let i: i32 = 0; i < keys.length; i++) {
        let val = obj.obj.get(keys[i]);
        let _path = path.join([parent, keys[i]]);
        if (val.isObject) {
            createDirectory(_path);
            toFS(val as JSON.Object, _path);
        } else if (val.isString) {
            let file = open(_path);
            file.writeString(val.val);
        }
    }

}


export const Hello = "Hello";
export const World = "World";
export const Hello_World = "Hello World";

export { Console, fs, Process, CommandLine, FileDescriptor }
