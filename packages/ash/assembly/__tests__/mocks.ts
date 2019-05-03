import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor } from '../../../assemblyscript/assembly/wasa/mock/fs';

Console.stdin
Console.stdout
Console.stderr

export function openStdout(): FileDescriptor {
    return open("/dev/fd/1");
}

export function open(path: string): FileDescriptor {
    let FD = fs.openForRead(path)
    if (FD.failed) {
        abort();
    }
    return FD.result;
}

export function testFile(): FileDescriptor {
    let fd = open("/test");
    fd.writeString(Hello_World);
    fd.reset();
    return fd;
}


export const Hello = "Hello";
export const World = "World";
export const Hello_World = Hello + " " + World;

// export { _Console as Console, fs, Process, CommandLine, FileDescriptor }