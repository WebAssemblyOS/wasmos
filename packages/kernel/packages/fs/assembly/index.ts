/**
 * This is the interface assemblyscript programs will use to access the filesystem.
 */

export class File {}

declare function open(path: string): File;

declare function close(f: File): void;

declare function write(f: File, c: Uint8Array | string): void;

declare function read(f: File, bytes: number): Uint8Array;
