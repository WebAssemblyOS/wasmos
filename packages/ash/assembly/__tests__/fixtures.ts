import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs/fs';
import { Wasi } from '../../../assemblyscript/assembly/wasi';

beforeAll(() => {
    fs.fs;
})

export function openStdout(): FileDescriptor {
    return open("/dev/fd/1");
}

export function open(path: string): FileDescriptor {
    let FD = fs.openFile(path)
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


export const Hello = "Hello";
export const World = "World";
export const Hello_World = "Hello World";

export { Console, fs, Process, CommandLine, FileDescriptor }
