//@ts-ignore
@global
export namespace Wasi {

    // === Types ======================================================================================

    /** File or memory access pattern advisory information. */
    export namespace advice {
        /** The application has no advice to give on its behavior with respect to the specified data. */
        // @ts-ignore: decorator
        @inline
        export const NORMAL: advice = 0;
        /** The application expects to access the specified data sequentially from lower offsets to higher offsets. */
        // @ts-ignore: decorator
        @inline
        export const SEQUENTIAL: advice = 1;
        /** The application expects to access the specified data in a random order. */
        // @ts-ignore: decorator
        @inline
        export const RANDOM: advice = 2;
        /** The application expects to access the specified data in the near future. */
        // @ts-ignore: decorator
        @inline
        export const WILLNEED: advice = 3;
        /** The application expects that it will not access the specified data in the near future. */
        // @ts-ignore: decorator
        @inline
        export const DONTNEED: advice = 4;
        /** The application expects to access the specified data once and then not reuse it thereafter. */
        // @ts-ignore: decorator
        @inline
        export const NOREUSE: advice = 5;
    }
    export type advice = u8;

    /** Identifiers for clocks. */
    export namespace clockid {
        /** The clock measuring real time. Time value zero corresponds with 1970-01-01T00:00:00Z. */
        // @ts-ignore: decorator
        @inline
        export const REALTIME: clockid = 0;
        /** The store-wide monotonic clock. Absolute value has no meaning. */
        // @ts-ignore: decorator
        @inline
        export const MONOTONIC: clockid = 1;
        /** The CPU-time clock associated with the current process. */
        // @ts-ignore: decorator
        @inline
        export const PROCESS_CPUTIME_ID: clockid = 2;
        /** The CPU-time clock associated with the current thread. */
        // @ts-ignore: decorator
        @inline
        export const THREAD_CPUTIME_ID: clockid = 3;
    }
    export type clockid = u32;

    /** Identifier for a device containing a file system. Can be used in combination with `inode` to uniquely identify a file or directory in the filesystem. */
    export type device = u64;

    /** A reference to the offset of a directory entry. */
    export type dircookie = u64;

    /** A directory entry. */
    @unmanaged export class dirent {
        /** The offset of the next directory entry stored in this directory. */
        next: dircookie;
        /** The serial number of the file referred to by this directory entry. */
        ino: inode;
        /** The length of the name of the directory entry. */
        namlen: u32;
        /** The type of the file referred to by this directory entry. */
        type: filetype;
        private __padding0: u16;
    }

    /** Error codes returned by functions. */
    export namespace errno {
        export function toString(errno: errno): string {
            switch (errno) {
                case SUCCESS: return "No error occurred. System call completed successfully.";
                case TOOBIG: return "Argument list too long.";
                case ACCES: return "Permission denied.";
                case ADDRINUSE: return "Address in use.";
                case ADDRNOTAVAIL: return "Address not available.";
                case AFNOSUPPORT: return "Address family not supported.";
                case AGAIN: return "Resource unavailable, or operation would block.";
                case ALREADY: return "Connection already in progress.";
                case BADF: return "Bad file descriptor.";
                case BADMSG: return "Bad message.";
                case BUSY: return "Device or resource busy.";
                case CANCELED: return "Operation canceled.";
                case CHILD: return "No child processes.";
                case CONNABORTED: return "Connection aborted.";
                case CONNREFUSED: return "Connection refused.";
                case CONNRESET: return "Connection reset.";
                case DEADLK: return "Resource deadlock would occur.";
                case DESTADDRREQ: return "Destination address required.";
                case DOM: return "Mathematics argument out of domain of function.";
                case DQUOT: return "Reserved.";
                case EXIST: return "File exists.";
                case FAULT: return "Bad address.";
                case FBIG: return "File too large.";
                case HOSTUNREACH: return "Host is unreachable.";
                case IDRM: return "Identifier removed.";
                case ILSEQ: return "Illegal byte sequence.";
                case INPROGRESS: return "Operation in progress.";
                case INTR: return "Interrupted function.";
                case INVAL: return "Invalid argument.";
                case IO: return "I/O error.";
                case ISCONN: return "Socket is connected.";
                case ISDIR: return "Is a directory.";
                case LOOP: return "Too many levels of symbolic links.";
                case MFILE: return "File descriptor value too large.";
                case MLINK: return "Too many links.";
                case MSGSIZE: return "Message too large.";
                case MULTIHOP: return "Reserved.";
                case NAMETOOLONG: return "Filename too long.";
                case NETDOWN: return "Network is down.";
                case NETRESET: return "Connection aborted by network.";
                case NETUNREACH: return "Network unreachable.";
                case NFILE: return "Too many files open in system.";
                case NOBUFS: return "No buffer space available.";
                case NODEV: return "No such device.";
                case NOENT: return "No such file or directory.";
                case NOEXEC: return "Executable file format error.";
                case NOLCK: return "No locks available.";
                case NOLINK: return "Reserved.";
                case NOMEM: return "Not enough space.";
                case NOMSG: return "No message of the desired type.";
                case NOPROTOOPT: return "Protocol not available.";
                case NOSPC: return "No space left on device.";
                case NOSYS: return "Function not supported.";
                case NOTCONN: return "The socket is not connected.";
                case NOTDIR: return "Not a directory or a symbolic link to a directory.";
                case NOTEMPTY: return "Directory not empty.";
                case NOTRECOVERABLE: return "State not recoverable.";
                case NOTSOCK: return "Not a socket.";
                case NOTSUP: return "Not supported, or operation not supported on socket.";
                case NOTTY: return "Inappropriate I/O control operation.";
                case NXIO: return "No such device or address.";
                case OVERFLOW: return "Value too large to be stored in data type.";
                case OWNERDEAD: return "Previous owner died.";
                case PERM: return "Operation not permitted.";
                case PIPE: return "Broken pipe.";
                case PROTO: return "Protocol error.";
                case PROTONOSUPPORT: return "Protocol not supported.";
                case PROTOTYPE: return "Protocol wrong type for socket.";
                case RANGE: return "Result too large.";
                case ROFS: return "Read-only file system.";
                case SPIPE: return "Invalid seek.";
                case SRCH: return "No such process.";
                case STALE: return "Reserved.";
                case TIMEDOUT: return "Connection timed out.";
                case TXTBSY: return "Text file busy.";
                case XDEV: return "Cross-device link.";
                case NOTCAPABLE: return "Extension: Capabilities insufficient.";
                default: return "error doesn't exist";
            }
        }

        /** No error occurred. System call completed successfully. */
        // @ts-ignore: decorator
        @inline
        export const SUCCESS: errno = 0;
        /** Argument list too long. */
        // @ts-ignore: decorator
        @inline
        export const TOOBIG: errno = 1;
        /** Permission denied. */
        // @ts-ignore: decorator
        @inline
        export const ACCES: errno = 2;
        /** Address in use. */
        // @ts-ignore: decorator
        @inline
        export const ADDRINUSE: errno = 3;
        /** Address not available. */
        // @ts-ignore: decorator
        @inline
        export const ADDRNOTAVAIL: errno = 4;
        /** Address family not supported. */
        // @ts-ignore: decorator
        @inline
        export const AFNOSUPPORT: errno = 5;
        /** Resource unavailable, or operation would block. */
        // @ts-ignore: decorator
        @inline
        export const AGAIN: errno = 6;
        /** Connection already in progress. */
        // @ts-ignore: decorator
        @inline
        export const ALREADY: errno = 7;
        /** Bad file descriptor. */
        // @ts-ignore: decorator
        @inline
        export const BADF: errno = 8;
        /** Bad message. */
        // @ts-ignore: decorator
        @inline
        export const BADMSG: errno = 9;
        /** Device or resource busy. */
        // @ts-ignore: decorator
        @inline
        export const BUSY: errno = 10;
        /** Operation canceled. */
        // @ts-ignore: decorator
        @inline
        export const CANCELED: errno = 11;
        /** No child processes. */
        // @ts-ignore: decorator
        @inline
        export const CHILD: errno = 12;
        /** Connection aborted. */
        // @ts-ignore: decorator
        @inline
        export const CONNABORTED: errno = 13;
        /** Connection refused. */
        // @ts-ignore: decorator
        @inline
        export const CONNREFUSED: errno = 14;
        /** Connection reset. */
        // @ts-ignore: decorator
        @inline
        export const CONNRESET: errno = 15;
        /** Resource deadlock would occur. */
        // @ts-ignore: decorator
        @inline
        export const DEADLK: errno = 16;
        /** Destination address required. */
        // @ts-ignore: decorator
        @inline
        export const DESTADDRREQ: errno = 17;
        /** Mathematics argument out of domain of function. */
        // @ts-ignore: decorator
        @inline
        export const DOM: errno = 18;
        /** Reserved. */
        // @ts-ignore: decorator
        @inline
        export const DQUOT: errno = 19;
        /** File exists. */
        // @ts-ignore: decorator
        @inline
        export const EXIST: errno = 20;
        /** Bad address. */
        // @ts-ignore: decorator
        @inline
        export const FAULT: errno = 21;
        /** File too large. */
        // @ts-ignore: decorator
        @inline
        export const FBIG: errno = 22;
        /** Host is unreachable. */
        // @ts-ignore: decorator
        @inline
        export const HOSTUNREACH: errno = 23;
        /** Identifier removed. */
        // @ts-ignore: decorator
        @inline
        export const IDRM: errno = 24;
        /** Illegal byte sequence. */
        // @ts-ignore: decorator
        @inline
        export const ILSEQ: errno = 25;
        /** Operation in progress. */
        // @ts-ignore: decorator
        @inline
        export const INPROGRESS: errno = 26;
        /** Interrupted function. */
        // @ts-ignore: decorator
        @inline
        export const INTR: errno = 27;
        /** Invalid argument. */
        // @ts-ignore: decorator
        @inline
        export const INVAL: errno = 28;
        /** I/O error. */
        // @ts-ignore: decorator
        @inline
        export const IO: errno = 29;
        /** Socket is connected. */
        // @ts-ignore: decorator
        @inline
        export const ISCONN: errno = 30;
        /** Is a directory. */
        // @ts-ignore: decorator
        @inline
        export const ISDIR: errno = 31;
        /** Too many levels of symbolic links. */
        // @ts-ignore: decorator
        @inline
        export const LOOP: errno = 32;
        /** File descriptor value too large. */
        // @ts-ignore: decorator
        @inline
        export const MFILE: errno = 33;
        /** Too many links. */
        // @ts-ignore: decorator
        @inline
        export const MLINK: errno = 34;
        /** Message too large. */
        // @ts-ignore: decorator
        @inline
        export const MSGSIZE: errno = 35;
        /** Reserved. */
        // @ts-ignore: decorator
        @inline
        export const MULTIHOP: errno = 36;
        /** Filename too long. */
        // @ts-ignore: decorator
        @inline
        export const NAMETOOLONG: errno = 37;
        /** Network is down. */
        // @ts-ignore: decorator
        @inline
        export const NETDOWN: errno = 38;
        /** Connection aborted by network. */
        // @ts-ignore: decorator
        @inline
        export const NETRESET: errno = 39;
        /** Network unreachable. */
        // @ts-ignore: decorator
        @inline
        export const NETUNREACH: errno = 40;
        /** Too many files open in system. */
        // @ts-ignore: decorator
        @inline
        export const NFILE: errno = 41;
        /** No buffer space available. */
        // @ts-ignore: decorator
        @inline
        export const NOBUFS: errno = 42;
        /** No such device. */
        // @ts-ignore: decorator
        @inline
        export const NODEV: errno = 43;
        /** No such file or directory. */
        // @ts-ignore: decorator
        @inline
        export const NOENT: errno = 44;
        /** Executable file format error. */
        // @ts-ignore: decorator
        @inline
        export const NOEXEC: errno = 45;
        /** No locks available. */
        // @ts-ignore: decorator
        @inline
        export const NOLCK: errno = 46;
        /** Reserved. */
        // @ts-ignore: decorator
        @inline
        export const NOLINK: errno = 47;
        /** Not enough space. */
        // @ts-ignore: decorator
        @inline
        export const NOMEM: errno = 48;
        /** No message of the desired type. */
        // @ts-ignore: decorator
        @inline
        export const NOMSG: errno = 49;
        /** Protocol not available. */
        // @ts-ignore: decorator
        @inline
        export const NOPROTOOPT: errno = 50;
        /** No space left on device. */
        // @ts-ignore: decorator
        @inline
        export const NOSPC: errno = 51;
        /** Function not supported. */
        // @ts-ignore: decorator
        @inline
        export const NOSYS: errno = 52;
        /** The socket is not connected. */
        // @ts-ignore: decorator
        @inline
        export const NOTCONN: errno = 53;
        /** Not a directory or a symbolic link to a directory. */
        // @ts-ignore: decorator
        @inline
        export const NOTDIR: errno = 54;
        /** Directory not empty. */
        // @ts-ignore: decorator
        @inline
        export const NOTEMPTY: errno = 55;
        /** State not recoverable. */
        // @ts-ignore: decorator
        @inline
        export const NOTRECOVERABLE: errno = 56;
        /** Not a socket. */
        // @ts-ignore: decorator
        @inline
        export const NOTSOCK: errno = 57;
        /** Not supported, or operation not supported on socket. */
        // @ts-ignore: decorator
        @inline
        export const NOTSUP: errno = 58;
        /** Inappropriate I/O control operation. */
        // @ts-ignore: decorator
        @inline
        export const NOTTY: errno = 59;
        /** No such device or address. */
        // @ts-ignore: decorator
        @inline
        export const NXIO: errno = 60;
        /** Value too large to be stored in data type. */
        // @ts-ignore: decorator
        @inline
        export const OVERFLOW: errno = 61;
        /** Previous owner died. */
        // @ts-ignore: decorator
        @inline
        export const OWNERDEAD: errno = 62;
        /** Operation not permitted. */
        // @ts-ignore: decorator
        @inline
        export const PERM: errno = 63;
        /** Broken pipe. */
        // @ts-ignore: decorator
        @inline
        export const PIPE: errno = 64;
        /** Protocol error. */
        // @ts-ignore: decorator
        @inline
        export const PROTO: errno = 65;
        /** Protocol not supported. */
        // @ts-ignore: decorator
        @inline
        export const PROTONOSUPPORT: errno = 66;
        /** Protocol wrong type for socket. */
        // @ts-ignore: decorator
        @inline
        export const PROTOTYPE: errno = 67;
        /** Result too large. */
        // @ts-ignore: decorator
        @inline
        export const RANGE: errno = 68;
        /** Read-only file system. */
        // @ts-ignore: decorator
        @inline
        export const ROFS: errno = 69;
        /** Invalid seek. */
        // @ts-ignore: decorator
        @inline
        export const SPIPE: errno = 70;
        /** No such process. */
        // @ts-ignore: decorator
        @inline
        export const SRCH: errno = 71;
        /** Reserved. */
        // @ts-ignore: decorator
        @inline
        export const STALE: errno = 72;
        /** Connection timed out. */
        // @ts-ignore: decorator
        @inline
        export const TIMEDOUT: errno = 73;
        /** Text file busy. */
        // @ts-ignore: decorator
        @inline
        export const TXTBSY: errno = 74;
        /** Cross-device link. */
        // @ts-ignore: decorator
        @inline
        export const XDEV: errno = 75;
        /** Extension: Capabilities insufficient. */
        // @ts-ignore: decorator
        @inline
        export const NOTCAPABLE: errno = 76;
    }
    export type errno = u16;

    /** An event that occurred. */
    @unmanaged export abstract class event {
        /** User-provided value that got attached to `subscription#userdata`. */
        userdata: userdata;
        /** If non-zero, an error that occurred while processing the subscription request. */
        error: errno;
        /* The type of the event that occurred. */
        type: eventtype;
        private __padding0: u16;
    }

    /** An event that occurred when type is `eventtype.FD_READ` or `eventtype.FD_WRITE`. */
    @unmanaged export class rwevent extends event {
        /* The number of bytes available for reading or writing. */
        nbytes: filesize;
        /* The state of the file descriptor. */
        flags: eventrwflags;
        private __padding1: u32;
    }

    /** The state of the file descriptor subscribed to with `eventtype.FD_READ` or `eventtype.FD_WRITE`. */
    export namespace eventrwflags {
        /** The peer of this socket has closed or disconnected. */
        // @ts-ignore: decorator
        @inline
        export const HANGUP: eventrwflags = 1;
    }
    export type eventrwflags = u16;

    /** Type of a subscription to an event or its occurrence. */
    export namespace eventtype {
        /** The time value of clock has reached the timestamp. */
        // @ts-ignore: decorator
        @inline
        export const CLOCK: eventtype = 0;
        /** File descriptor has data available for reading. */
        // @ts-ignore: decorator
        @inline
        export const FD_READ: eventtype = 1;
        /** File descriptor has capacity available for writing */
        // @ts-ignore: decorator
        @inline
        export const FD_WRITE: eventtype = 2;
    }
    export type eventtype = u8;

    /** Exit code generated by a process when exiting. */
    export type exitcode = u32;

    /** A file descriptor number. */
    export type fd = u32;

    /** File descriptor flags. */
    export namespace fdflags {
        /** Append mode: Data written to the file is always appended to the file's end. */
        // @ts-ignore: decorator
        @inline
        export const APPEND: fdflags = 1;
        /** Write according to synchronized I/O data integrity completion. Only the data stored in the file is synchronized. */
        // @ts-ignore: decorator
        @inline
        export const DSYNC: fdflags = 2;
        /** Non-blocking mode. */
        // @ts-ignore: decorator
        @inline
        export const NONBLOCK: fdflags = 4;
        /** Synchronized read I/O operations. */
        // @ts-ignore: decorator
        @inline
        export const RSYNC: fdflags = 8;
        /** Write according to synchronized I/O file integrity completion. */
        // @ts-ignore: decorator
        @inline
        export const SYNC: fdflags = 16;
    }
    export type fdflags = u16;

    /** File descriptor attributes. */
    @unmanaged export class fdstat {
        /** File type. */
        filetype: filetype;
        /** File descriptor flags. */
        flags: fdflags;
        /** Rights that apply to this file descriptor. */
        rights_base: rights;
        /** Maximum set of rights that may be installed on new file descriptors that are created through this file descriptor, e.g., through `path_open`. */
        rights_inheriting: rights;
    }

    /** Relative offset within a file. */
    export type filedelta = i64;

    /** Non-negative file size or length of a region within a file. */
    export type filesize = u64;

    /** File attributes. */
    @unmanaged export class filestat {
        /** Device ID of device containing the file. */
        dev: device;
        /** File serial number. */
        ino: inode;
        /** File type. */
        filetype: filetype;
        /** Number of hard links to the file. */
        nlink: linkcount;
        /** For regular files, the file size in bytes. For symbolic links, the length in bytes of the pathname contained in the symbolic link. */
        size: filesize;
        /** Last data access timestamp. */
        atim: timestamp;
        /** Last data modification timestamp. */
        mtim: timestamp;
        /** Last file status change timestamp. */
        ctim: timestamp;
    }

    /** The type of a file descriptor or file. */
    export namespace filetype {
        /** The type of the file descriptor or file is unknown or is different from any of the other types specified. */
        // @ts-ignore: decorator
        @inline
        export const UNKNOWN: filetype = 0;
        /** The file descriptor or file refers to a block device inode. */
        // @ts-ignore: decorator
        @inline
        export const BLOCK_DEVICE: filetype = 1;
        /** The file descriptor or file refers to a character device inode. */
        // @ts-ignore: decorator
        @inline
        export const CHARACTER_DEVICE: filetype = 2;
        /** The file descriptor or file refers to a directory inode. */
        // @ts-ignore: decorator
        @inline
        export const DIRECTORY: filetype = 3;
        /** The file descriptor or file refers to a regular file inode. */
        // @ts-ignore: decorator
        @inline
        export const REGULAR_FILE: filetype = 4;
        /** The file descriptor or file refers to a datagram socket. */
        // @ts-ignore: decorator
        @inline
        export const SOCKET_DGRAM: filetype = 5;
        /** The file descriptor or file refers to a byte-stream socket. */
        // @ts-ignore: decorator
        @inline
        export const SOCKET_STREAM: filetype = 6;
        /** The file refers to a symbolic link inode. */
        // @ts-ignore: decorator
        @inline
        export const SYMBOLIC_LINK: filetype = 7;
    }
    export type filetype = u8;

    /** Which file time attributes to adjust. */
    export namespace fstflags {
        /** Adjust the last data access timestamp to the value stored in `filestat#st_atim`. */
        // @ts-ignore: decorator
        @inline
        export const SET_ATIM: fstflags = 1;
        /** Adjust the last data access timestamp to the time of clock `clockid.REALTIME`. */
        // @ts-ignore: decorator
        @inline
        export const SET_ATIM_NOW: fstflags = 2;
        /** Adjust the last data modification timestamp to the value stored in `filestat#st_mtim`. */
        // @ts-ignore: decorator
        @inline
        export const SET_MTIM: fstflags = 4;
        /** Adjust the last data modification timestamp to the time of clock `clockid.REALTIME`. */
        // @ts-ignore: decorator
        @inline
        export const SET_MTIM_NOW: fstflags = 8;
    }
    export type fstflags = u16;

    /** File serial number that is unique within its file system. */
    export type inode = u64;

    /** A region of memory for scatter/gather reads. */
    @unmanaged export class iovec {
        /** The address of the buffer to be filled. */
        buf: usize;
        /** The length of the buffer to be filled. */
        buf_len: usize;
    }

    /** Number of hard links to an inode. */
    export type linkcount = u32;

    /** Flags determining the method of how paths are resolved. */
    export namespace lookupflags {
        /** As long as the resolved path corresponds to a symbolic link, it is expanded. */
        // @ts-ignore: decorator
        @inline
        export const SYMLINK_FOLLOW: lookupflags = 1;
    }
    export type lookupflags = u32;

    /** Open flags. */
    export namespace oflags {
        /** Create file if it does not exist. */
        // @ts-ignore: decorator
        @inline
        export const CREAT: oflags = 1;
        /** Fail if not a directory. */
        // @ts-ignore: decorator
        @inline
        export const DIRECTORY: oflags = 2;
        /** Fail if file already exists. */
        // @ts-ignore: decorator
        @inline
        export const EXCL: oflags = 4;
        /** Truncate file to size 0. */
        // @ts-ignore: decorator
        @inline
        export const TRUNC: oflags = 8;
    }
    export type oflags = u16;

    // TODO: undocumented
    export namespace preopentype {
        // @ts-ignore: decorator
        @inline
        export const DIR: preopentype = 0;
    }
    export type preopentype = u8;

    // TODO: undocumented
    export abstract class prestat {
        type: preopentype;
    }

    // TODO: undocumented
    export class dirprestat extends prestat {
        name_len: usize;
    }

    /** Flags provided to `sock_recv`. */
    export namespace riflags {
        /** Returns the message without removing it from the socket's receive queue. */
        // @ts-ignore: decorator
        @inline
        export const PEEK: riflags = 1;
        /** On byte-stream sockets, block until the full amount of data can be returned. */
        // @ts-ignore: decorator
        @inline
        export const WAITALL: riflags = 2;
    }
    export type riflags = u16;

    /** File descriptor rights, determining which actions may be performed. */
    export namespace rights {
        /** The right to invoke `fd_datasync`. */
        // @ts-ignore: decorator
        @inline
        export const FD_DATASYNC: rights = 1;
        /** The right to invoke `fd_read` and `sock_recv`. */
        // @ts-ignore: decorator
        @inline
        export const FD_READ: rights = 2;
        /** The right to invoke `fd_seek`. This flag implies `rights.FD_TELL`. */
        // @ts-ignore: decorator
        @inline
        export const FD_SEEK: rights = 4;
        /** The right to invoke `fd_fdstat_set_flags`. */
        // @ts-ignore: decorator
        @inline
        export const FD_FDSTAT_SET_FLAGS: rights = 8;
        /** The right to invoke `fd_sync`. */
        // @ts-ignore: decorator
        @inline
        export const FD_SYNC: rights = 16;
        /** The right to invoke `fd_seek` in such a way that the file offset remains unaltered (i.e., `whence.CUR` with offset zero), or to invoke `fd_tell`). */
        // @ts-ignore: decorator
        @inline
        export const FD_TELL: rights = 32;
        /** The right to invoke `fd_write` and `sock_send`. If `rights.FD_SEEK` is set, includes the right to invoke `fd_pwrite`. */
        // @ts-ignore: decorator
        @inline
        export const FD_WRITE: rights = 64;
        /** The right to invoke `fd_advise`. */
        // @ts-ignore: decorator
        @inline
        export const FD_ADVISE: rights = 128;
        /** The right to invoke `fd_allocate`. */
        // @ts-ignore: decorator
        @inline
        export const FD_ALLOCATE: rights = 256;
        /** The right to invoke `path_create_directory`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_CREATE_DIRECTORY: rights = 512;
        /** If `rights.PATH_OPEN` is set, the right to invoke `path_open` with `oflags.CREAT`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_CREATE_FILE: rights = 1024;
        /** The right to invoke `path_link` with the file descriptor as the source directory. */
        // @ts-ignore: decorator
        @inline
        export const PATH_LINK_SOURCE: rights = 2048;
        /** The right to invoke `path_link` with the file descriptor as the target directory. */
        // @ts-ignore: decorator
        @inline
        export const PATH_LINK_TARGET: rights = 4096;
        /** The right to invoke `path_open`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_OPEN: rights = 8192;
        /** The right to invoke `fd_readdir`. */
        // @ts-ignore: decorator
        @inline
        export const FD_READDIR: rights = 16384;
        /** The right to invoke `path_readlink`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_READLINK: rights = 32768;
        /** The right to invoke `path_rename` with the file descriptor as the source directory. */
        // @ts-ignore: decorator
        @inline
        export const PATH_RENAME_SOURCE: rights = 65536;
        /** The right to invoke `path_rename` with the file descriptor as the target directory. */
        // @ts-ignore: decorator
        @inline
        export const PATH_RENAME_TARGET: rights = 131072;
        /** The right to invoke `path_filestat_get`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_FILESTAT_GET: rights = 262144;
        /** The right to change a file's size (there is no `path_filestat_set_size`). If `rights.PATH_OPEN` is set, includes the right to invoke `path_open` with `oflags.TRUNC`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_FILESTAT_SET_SIZE: rights = 524288;
        /** The right to invoke `path_filestat_set_times`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_FILESTAT_SET_TIMES: rights = 1048576;
        /** The right to invoke `fd_filestat_get`. */
        // @ts-ignore: decorator
        @inline
        export const FD_FILESTAT_GET: rights = 2097152;
        /** The right to invoke `fd_filestat_set_size`. */
        // @ts-ignore: decorator
        @inline
        export const FD_FILESTAT_SET_SIZE: rights = 4194304;
        /** The right to invoke `fd_filestat_set_times`. */
        // @ts-ignore: decorator
        @inline
        export const FD_FILESTAT_SET_TIMES: rights = 8388608;
        /** The right to invoke `path_symlink`. */
        // @ts-ignore: decorator
        @inline
        export const RIGHT_PATH_SYMLINK: rights = 16777216;
        /** The right to invoke `path_remove_directory`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_REMOVE_DIRECTORY: rights = 33554432;
        /** The right to invoke `path_unlink_file`. */
        // @ts-ignore: decorator
        @inline
        export const PATH_UNLINK_FILE: rights = 67108864;
        /** If `rights.FD_READ` is set, includes the right to invoke `poll_oneoff` to subscribe to `eventtype.FD_READ`. If `rights.FD_WRITE` is set, includes the right to invoke `poll_oneoff` to subscribe to `eventtype.FD_WRITE`. */
        // @ts-ignore: decorator
        @inline
        export const POLL_FD_READWRITE: rights = 134217728;
        /** The right to invoke `sock_shutdown`. */
        // @ts-ignore: decorator
        @inline
        export const SOCK_SHUTDOWN: rights = 268435456;
    }
    export type rights = u64;

    /** Flags returned by `sock_recv`. */
    export namespace roflags {
        /** Message data has been truncated. */
        // @ts-ignore: decorator
        @inline
        export const DATA_TRUNCATED: roflags = 1;
    }
    export type roflags = u16;

    /** Which channels on a socket to shut down. */
    export namespace sdflags {
        /** Disables further receive operations. */
        // @ts-ignore: decorator
        @inline
        export const RD: sdflags = 1;
        /** Disables further send operations. */
        // @ts-ignore: decorator
        @inline
        export const WR: sdflags = 2;
    }
    export type sdflags = u8;

    /** Flags provided to `sock_send`. */
    export namespace siflags {
        // As there are currently no flags defined, it must be set to zero.
    }
    export type siflags = u16;

    /** Signal condition. */
    export namespace signal {
        /** Hangup. */
        // @ts-ignore: decorator
        @inline
        export const HUP: signal = 1;
        /** Terminate interrupt signal. */
        // @ts-ignore: decorator
        @inline
        export const INT: signal = 2;
        /** Terminal quit signal. */
        // @ts-ignore: decorator
        @inline
        export const QUIT: signal = 3;
        /** Illegal instruction. */
        // @ts-ignore: decorator
        @inline
        export const ILL: signal = 4;
        /** Trace/breakpoint trap. */
        // @ts-ignore: decorator
        @inline
        export const TRAP: signal = 5;
        /** Process abort signal. */
        // @ts-ignore: decorator
        @inline
        export const ABRT: signal = 6;
        /** Access to an undefined portion of a memory object. */
        // @ts-ignore: decorator
        @inline
        export const BUS: signal = 7;
        /** Erroneous arithmetic operation. */
        // @ts-ignore: decorator
        @inline
        export const FPE: signal = 8;
        /** Kill. */
        // @ts-ignore: decorator
        @inline
        export const KILL: signal = 9;
        /** User-defined signal 1. */
        // @ts-ignore: decorator
        @inline
        export const USR1: signal = 10;
        /** Invalid memory reference. */
        // @ts-ignore: decorator
        @inline
        export const SEGV: signal = 11;
        /** User-defined signal 2. */
        // @ts-ignore: decorator
        @inline
        export const USR2: signal = 12;
        /** Write on a pipe with no one to read it. */
        // @ts-ignore: decorator
        @inline
        export const PIPE: signal = 13;
        /** Alarm clock. */
        // @ts-ignore: decorator
        @inline
        export const ALRM: signal = 14;
        /** Termination signal. */
        // @ts-ignore: decorator
        @inline
        export const TERM: signal = 15;
        /** Child process terminated, stopped, or continued. */
        // @ts-ignore: decorator
        @inline
        export const CHLD: signal = 16;
        /** Continue executing, if stopped. */
        // @ts-ignore: decorator
        @inline
        export const CONT: signal = 17;
        /** Stop executing. */
        // @ts-ignore: decorator
        @inline
        export const STOP: signal = 18;
        /** Terminal stop signal. */
        // @ts-ignore: decorator
        @inline
        export const TSTP: signal = 19;
        /** Background process attempting read. */
        // @ts-ignore: decorator
        @inline
        export const TTIN: signal = 20;
        /** Background process attempting write. */
        // @ts-ignore: decorator
        @inline
        export const TTOU: signal = 21;
        /** High bandwidth data is available at a socket. */
        // @ts-ignore: decorator
        @inline
        export const URG: signal = 22;
        /** CPU time limit exceeded. */
        // @ts-ignore: decorator
        @inline
        export const XCPU: signal = 23;
        /** File size limit exceeded. */
        // @ts-ignore: decorator
        @inline
        export const XFSZ: signal = 24;
        /** Virtual timer expired. */
        // @ts-ignore: decorator
        @inline
        export const VTALRM: signal = 25;
        // @ts-ignore: decorator
        @inline
        export const PROF: signal = 26;
        // @ts-ignore: decorator
        @inline
        export const WINCH: signal = 27;
        // @ts-ignore: decorator
        @inline
        export const POLL: signal = 28;
        // @ts-ignore: decorator
        @inline
        export const PWR: signal = 29;
        /** Bad system call. */
        // @ts-ignore: decorator
        @inline
        export const SYS: signal = 30;
    }
    export type signal = u8;

    /** Flags determining how to interpret the timestamp provided in `subscription_t::u.clock.timeout. */
    export namespace subclockflags {
        /** If set, treat the timestamp provided in `clocksubscription` as an absolute timestamp. */
        // @ts-ignore: decorator
        @inline
        export const ABSTIME: subclockflags = 1;
    }
    export type subclockflags = u16;

    /** Subscription to an event. */
    @unmanaged export abstract class subscription {
        /** User-provided value that is attached to the subscription. */
        userdata: userdata;
        /** The type of the event to which to subscribe. */
        type: eventtype;
        private __padding0: u32;
    }

    /* Subscription to an event of type `eventtype.CLOCK`.**/
    @unmanaged export class clocksubscription extends subscription {
        /** The user-defined unique identifier of the clock. */
        identifier: userdata;
        /** The clock against which to compare the timestamp. */
        clock_id: clockid;
        /** The absolute or relative timestamp. */
        timeout: timestamp;
        /** The amount of time that the implementation may wait additionally to coalesce with other events. */
        precision: timestamp;
        /** Flags specifying whether the timeout is absolute or relative. */
        flags: subclockflags;
        private __padding1: u32;
    }

    /* Subscription to an event of type `eventtype.FD_READ` or `eventtype.FD_WRITE`.**/
    @unmanaged export class fdsubscription extends subscription {
        /** The file descriptor on which to wait for it to become ready for reading or writing. */
        fd: fd;
    }

    /** Timestamp in nanoseconds. */
    export type timestamp = u64;

    /** User-provided value that may be attached to objects that is retained when extracted from the implementation. */
    export type userdata = u64;

    /** The position relative to which to set the offset of the file descriptor. */
    export namespace whence {
        /** Seek relative to current position. */
        // @ts-ignore: decorator
        @inline
        export const CUR: whence = 0;
        /** Seek relative to end-of-file. */
        // @ts-ignore: decorator
        @inline
        export const END: whence = 1;
        /** Seek relative to start-of-file. */
        // @ts-ignore: decorator
        @inline
        export const SET: whence = 2;
    }
    export type whence = u8;
}