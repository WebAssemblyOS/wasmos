
// helper types to be more explicit
type char = u8;
type ptr<T> = usize; // all pointers are usize'd
type struct<T> = T;  // structs are references already in AS




declare namespace Wasi {

    export interface Wasi {
        /** Read command-line argument data. */
        args_get(
            /** Input: Pointer to a buffer to write the argument pointers. */
            argv: ptr<ptr<char>>,
            /** Input: Pointer to a buffer to write the argument string data. */
            argv_buf: ptr<char>
        ): errno;
        //
        /** Return command-line argument data sizes. */
        args_sizes_get(
            /** Output: Number of arguments. */
            argc: ptr<usize>,
            /** Output: Size of the argument string data. */
            argv_buf_size: ptr<usize>
        ): errno;

        /** Return the resolution of a clock. */
        clock_res_get(
            /** Input: The clock for which to return the resolution. */
            clock: clockid,
            /** Output: The resolution of the clock. */
            resolution: ptr<timestamp>
        ): errno;

        /** Return the time value of a clock. */
        clock_time_get(
            /** Input: Cock for which to return the time. */
            clock: clockid,
            /** Input: Maximum lag (exclusive) that the returned time value may have, compared to its actual value. */
            precision: timestamp,
            /** Output: Time value of the clock. */
            time: ptr<timestamp>
        ): errno;

        /** Read environment variable data. */
        environ_get(
            /** Input: Pointer to a buffer to write the environment variable pointers. */
            environ: ptr<usize>,
            /** Input: Pointer to a buffer to write the environment variable string data. */
            environ_buf: usize
        ): errno;

        /** Return command-line argument data sizes. */
        environ_sizes_get(
            /** Output: The number of environment variables. */
            environ_count: ptr<usize>,
            /** Output: The size of the environment variable string data. */
            environ_buf_size: ptr<usize>
        ): errno;

        /** Provide file advisory information on a file descriptor. */
        fd_advise(
            /** Input: The file descriptor for the file for which to provide file advisory information. */
            fd: fd,
            /** Input: The offset within the file to which the advisory applies. */
            offset: filesize,
            /** Input: The length of the region to which the advisory applies. */
            len: filesize,
            /** Input: The advice. */
            advice: advice
        ): errno;

        /** Provide file advisory information on a file descriptor. */
        fd_allocate(
            /** Input: The file descriptor for the file in which to allocate space. */
            fd: fd,
            /** Input: The offset at which to start the allocation. */
            offset: filesize,
            /** Input: The length of the area that is allocated. */
            len: filesize
        ): errno;

        /** Close a file descriptor. */
        fd_close(
            /** Input: The file descriptor to close. */
            fd: fd
        ): errno;

        /** Synchronize the data of a file to disk. */
        fd_datasync(
            /** Input: The file descriptor of the file to synchronize to disk. */
            fd: fd
        ): errno;

        /** Get the attributes of a file descriptor. */
        fd_fdstat_get(
            /** Input: The file descriptor to inspect. */
            fd: fd,
            /** Input: The buffer where the file descriptor's attributes are stored. */
            buf: struct<fdstat>
        ): errno;

        /** Adjust the flags associated with a file descriptor. */
        fd_fdstat_set_flags(
            /** Input: The file descriptor to operate on. */
            fd: fd,
            /** Input: The desired values of the file descriptor flags. */
            flags: fdflags
        ): errno;

        /** Adjust the rights associated with a file descriptor. */
        fd_fdstat_set_rights(
            /** Input: The file descriptor to operate on. */
            fd: fd,
            /** Input: The desired rights of the file descriptor. */
            fs_rights_base: rights,
            /** Input: The desired rights of the file descriptor. */
            fs_rights_inheriting: rights
        ): errno;

        /** Return the attributes of an open file. */
        fd_filestat_get(
            /** Input: The file descriptor to inspect. */
            fd: fd,
            /** Input: The buffer where the file's attributes are stored. */
            buf: struct<filestat>
        ): errno;

        /** Adjust the size of an open file. If this increases the file's size, the extra bytes are filled with zeros. */
        fd_filestat_set_size(
            /** Input: A file descriptor for the file to adjust. */
            fd: fd,
            /** Input: The desired file size. */
            size: filesize
        ): errno;

        /** Adjust the timestamps of an open file or directory. */
        fd_filestat_set_times(
            /** Input: The file descriptor to operate on. */
            fd: fd,
            /** Input: The desired values of the data access timestamp. */
            st_atim: timestamp,
            /** Input: The desired values of the data modification timestamp. */
            st_mtim: timestamp,
            /** Input: A bitmask indicating which timestamps to adjust. */
            fstflags: fstflags
        ): errno;

        /** Read from a file descriptor, without using and updating the file descriptor's offset. */
        fd_pread(
            /** Input: The file descriptor from which to read data. */
            fd: fd,
            /** Input: List of scatter/gather vectors in which to store data. */
            iovs: ptr<struct<iovec>>,
            /** Input: Length of the list of scatter/gather vectors in which to store data. */
            iovs_len: usize,
            /** Input: The offset within the file at which to read. */
            offset: filesize,
            /** Output: The number of bytes read. */
            nread: ptr<usize>
        ): errno;

        /** Return a description of the given preopened file descriptor. */
        fd_prestat_get(
            /** Input: The file descriptor about which to retrieve information. */
            fd: fd,
            /** Input: The buffer where the description is stored. */
            buf: struct<prestat>
        ): errno;

        /** Return a description of the given preopened file descriptor. */
        fd_prestat_dir_name(
            /** Input: The file descriptor about which to retrieve information. */
            fd: fd,
            /** Input: Buffer into which to write the preopened directory name. */
            path: ptr<char>,
            /** Input: Length of the buffer into which to write the preopened directory name. */
            path_len: usize
        ): errno;

        /** Write to a file descriptor, without using and updating the file descriptor's offset. */
        fd_pwrite(
            /** Input: The file descriptor to which to write data. */
            fd: fd,
            /** Input: List of scatter/gather vectors from which to retrieve data. */
            iovs: ptr<struct<iovec>>,
            /** Input: Length of the list of scatter/gather vectors from which to retrieve data. */
            iovs_len: usize,
            /** Input: The offset within the file at which to write. */
            offset: filesize,
            /** Output: The number of bytes written. */
            nwritten: ptr<usize>
        ): errno;

        /** Read from a file descriptor. */
        fd_read(
            /** Input: The file descriptor from which to read data. */
            fd: fd,
            /** Input: List of scatter/gather vectors to which to store data. */
            iovs: ptr<struct<iovec>>,
            /** Input: Length of the list of scatter/gather vectors to which to store data. */
            iovs_len: usize,
            /** Output: The number of bytes read. */
            nread: ptr<usize>
        ): errno;

        /** Read directory entries from a directory. */
        fd_readdir(
            /** Input: Directory from which to read the directory entries. */
            fd: fd,
            /** Input: Buffer where directory entries are stored. */
            buf: ptr<struct<dirent>>,
            /** Input: Length of the buffer where directory entries are stored. */
            buf_len: usize,
            /** Input: Location within the directory to start reading. */
            cookie: dircookie,
            /** Output: Number of bytes stored in the read buffer. If less than the size of the read buffer, the end of the directory has been reached. */
            buf_used: ptr<usize>
        ): errno;

        /** Atomically replace a file descriptor by renumbering another file descriptor. */
        fd_renumber(
            /** Input: The file descriptor to renumber. */
            from: fd,
            /** Input: The file descriptor to overwrite. */
            to: fd
        ): errno;

        /** Move the offset of a file descriptor. */
        fd_seek(
            /** Input: The file descriptor to operate on. */
            fd: fd,
            /** Input: The number of bytes to move. */
            offset: filedelta,
            /** Input: The base from which the offset is relative. */
            whence: whence,
            /** Output: The new offset of the file descriptor, relative to the start of the file. */
            newoffset: ptr<filesize>
        ): errno;

        /** Synchronize the data and metadata of a file to disk. */
        fd_sync(
            /** Input: The file descriptor of the file containing the data and metadata to synchronize to disk. */
            fd: fd
        ): errno;

        /** Return the current offset of a file descriptor. */
        fd_tell(
            /** Input: The file descriptor to inspect. */
            fd: fd,
            /** Output: The current offset of the file descriptor, relative to the start of the file. */
            newoffset: ptr<filesize>
        ): errno;

        /** Write to a file descriptor. */
        fd_write(
            /** Input: The file descriptor to which to write data. */
            fd: fd,
            /** Input: List of scatter/gather vectors from which to retrieve data. */
            iovs: ptr<struct<iovec>>,
            /** Input: List of scatter/gather vectors from which to retrieve data. */
            iovs_len: usize,
            /** Output: The number of bytes written. */
            nwritten: ptr<usize>
        ): errno;

        /* Create a directory. */
        path_create_directory(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: The path at which to create the directory. */
            path: ptr<char>,
            /** Input: The path at which to create the directory. */
            path_len: usize
        ): errno;

        /** Return the attributes of a file or directory. */
        path_filestat_get(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: Flags determining the method of how the path is resolved. */
            flags: lookupflags,
            /** Input: The path of the file or directory to inspect. */
            path: ptr<char>,
            /** Input: The path of the file or directory to inspect. */
            path_len: usize,
            /** Input: The buffer where the file's attributes are stored. */
            buf: struct<filestat>
        ): errno;

        /** Adjust the timestamps of a file or directory. */
        path_filestat_set_times(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: Flags determining the method of how the path is resolved. */
            flags: lookupflags,
            /** Input: The path of the file or directory to operate on. */
            path: ptr<char>,
            /** Input: The path of the file or directory to operate on. */
            path_len: usize,
            /** Input: The desired values of the data access timestamp. */
            st_atim: timestamp,
            /** Input: The desired values of the data modification timestamp. */
            st_mtim: timestamp,
            /** Input: A bitmask indicating which timestamps to adjust. */
            fstflags: fstflags
        ): errno;

        /** Create a hard link. */
        path_link(
            /** Input: The working directory at which the resolution of the old path starts. */
            old_fd: fd,
            /** Input: Flags determining the method of how the path is resolved. */
            old_flags: lookupflags,
            /** Input: The source path from which to link. */
            old_path: ptr<char>,
            /** Input: The source path from which to link. */
            old_path_len: usize,
            /** Input: The working directory at which the resolution of the new path starts. */
            new_fd: fd,
            /** Input: The destination path at which to create the hard link. */
            new_path: ptr<char>,
            /** Input: The length of the destination path at which to create the hard link. */
            new_path_len: usize
        ): errno;

        /** Open a file or directory. */
        path_open(
            /** Input: The working directory at which the resolution of the path starts. */
            dirfd: fd,
            /** Input: Flags determining the method of how the path is resolved. */
            dirflags: lookupflags,
            /** Input: The path of the file or directory to open. */
            path: ptr<char>,
            /** Input: The length of the path of the file or directory to open. */
            path_len: usize,
            /** Input: The method by which to open the file. */
            oflags: oflags,
            /** Input: The initial base rights that apply to operations using the file descriptor itself. */
            fs_rights_base: rights,
            /** Input: The initial inheriting rights that apply to file descriptors derived from it. */
            fs_rights_inheriting: rights,
            /** Input: The initial flags of the file descriptor. */
            fs_flags: fdflags,
            /** Output: The file descriptor of the file that has been opened. */
            fd: ptr<fd>
        ): errno;

        /** Read the contents of a symbolic link. */
        path_readlink(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: The path of the symbolic link from which to read. */
            path: ptr<char>,
            /** Input: The length of the path of the symbolic link from which to read. */
            path_len: usize,
            /** Input: The buffer to which to write the contents of the symbolic link. */
            buf: ptr<char>,
            /** Input: The length of the buffer to which to write the contents of the symbolic link. */
            buf_len: usize,
            /** Output: The number of bytes placed in the buffer. */
            buf_used: ptr<usize>
        ): errno;

        /** Remove a directory. */
        path_remove_directory(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: The path to a directory to remove. */
            path: ptr<char>,
            /** Input: The length of the path to a directory to remove. */
            path_len: usize
        ): errno;

        /** Rename a file or directory. */
        path_rename(
            /** Input: The working directory at which the resolution of the old path starts. */
            old_fd: fd,
            /** Input: The source path of the file or directory to rename. */
            old_path: ptr<char>,
            /** Input: The length of the source path of the file or directory to rename. */
            old_path_len: usize,
            /** Input: The working directory at which the resolution of the new path starts. */
            new_fd: fd,
            /** Input: The destination path to which to rename the file or directory. */
            new_path: ptr<char>,
            /** Input: The length of the destination path to which to rename the file or directory. */
            new_path_len: usize
        ): errno;

        /** Create a symbolic link. */
        path_symlink(
            /** Input: The contents of the symbolic link. */
            old_path: ptr<char>,
            /** Input: The length of the contents of the symbolic link. */
            old_path_len: usize,
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: The destination path at which to create the symbolic link. */
            new_path: ptr<char>,
            /** Input: The length of the destination path at which to create the symbolic link. */
            new_path_len: usize
        ): errno;

        /** Unlink a file. */
        path_unlink_file(
            /** Input: The working directory at which the resolution of the path starts. */
            fd: fd,
            /** Input: The path to a file to unlink. */
            path: ptr<char>,
            /** Input: The length of the path to a file to unlink. */
            path_len: usize
        ): errno;

        /** Concurrently poll for the occurrence of a set of events. */
        poll_oneoff(
            /** Input: The events to which to subscribe. */
            in_: ptr<struct<subscription>>,
            /** Input: The events that have occurred. */
            out: ptr<struct<event>>,
            /** Input: Both the number of subscriptions and events. */
            nsubscriptions: usize,
            /** Output: The number of events stored. */
            nevents: ptr<usize>
        ): errno;

        /** Terminate the process normally. An exit code of 0 indicates successful termination of the program. The meanings of other values is dependent on the environment. */
        proc_exit(
            /** Input: The exit code returned by the process. */
            rval: u32
        ): void;

        /** Send a signal to the process of the calling thread. */
        proc_raise(
            /** Input: The signal condition to trigger. */
            sig: signal
        ): errno;

        /** Write high-quality random data into a buffer. */
        random_get(
            /** Input: The buffer to fill with random data. */
            buf: usize,
            /** Input: The length of the buffer to fill with random data. */
            buf_len: usize
        ): errno;

        /** Temporarily yield execution of the calling thread. */
        sched_yield(): errno;

        /** Receive a message from a socket. */
        sock_recv(
            /** Input: The socket on which to receive data. */
            sock: fd,
            /** Input: List of scatter/gather vectors to which to store data. */
            ri_data: ptr<struct<iovec>>,
            /** Input: The length of the list of scatter/gather vectors to which to store data. */
            ri_data_len: usize,
            /** Input: Message flags. */
            ri_flags: riflags,
            /** Output: Number of bytes stored in `ri_data`. */
            ro_datalen: ptr<usize>,
            /** Output: Message flags. */
            ro_flags: ptr<roflags>
        ): errno;

        /** Send a message on a socket. */
        sock_send(
            /** Input: The socket on which to send data. */
            sock: fd,
            /** Input: List of scatter/gather vectors to which to retrieve data */
            si_data: ptr<struct<iovec>>,
            /** Input: The length of the list of scatter/gather vectors to which to retrieve data */
            si_data_len: usize,
            /** Input: Message flags. */
            si_flags: siflags,
            /** Output: Number of bytes transmitted. */
            so_datalen: ptr<usize>
        ): errno;

        /** Shut down socket send and receive channels. */
        sock_shutdown(
            /** Input: The socket on which to shutdown channels. */
            sock: fd,
            /** Input: Which channels on the socket to shut down. */
            how: sdflags
        ): errno;
    }

    // === Types ======================================================================================

    export const ExitSuccess = 0;

    /** File or memory access pattern advisory information. */
    export enum advice {
        /** The application has no advice to give on its behavior with respect to the specified data. */
        NORMAL = 0,
        //   /** The application expects to access the specified data sequentially from lower offsets to higher offsets. */
        SEQUENTIAL = 1,
        //   /** The application expects to access the specified data in a random order. */
        RANDOM = 2,
        //   /** The application expects to access the specified data in the near future. */
        WILLNEED = 3,
        //   /** The application expects that it will not access the specified data in the near future. */
        DONTNEED = 4,
        //   /** The application expects to access the specified data once and then not reuse it thereafter. */
        NOREUSE = 5,
    }

    /** Identifiers for clocks. */
    export enum clockid {
        /** The clock measuring real time. Time value zero corresponds with 1970-01-01T00:00:00Z. */
        REALTIME = 0,
        //   /** The store-wide monotonic clock. Absolute value has no meaning. */
        MONOTONIC = 1,
        //   /** The CPU-time clock associated with the current process. */
        PROCESS_CPUTIME_ID = 2,
        //   /** The CPU-time clock associated with the current thread. */
        THREAD_CPUTIME_ID = 3,
    }

    /** Identifier for a device containing a file system. Can be used in combination with `inode` to uniquely identify a file or directory in the filesystem. */
    export type device = u64;

    /** A reference to the offset of a directory entry. */
    export type dircookie = u64;

    /** A directory entry. */
    export class dirent {
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
    export enum errno {
        /** No error occurred. System call completed successfully. */
        SUCCESS = 0,
        /** Argument list too long. */
        TOOBIG = 1,
        /** Permission denied. */
        ACCES = 2,
        /** Address in use. */
        ADDRINUSE = 3,
        /** Address not available. */
        ADDRNOTAVAIL = 4,
        /** Address family not supported. */
        AFNOSUPPORT = 5,
        /** Resource unavailable, or operation would block. */
        AGAIN = 6,
        /** Connection already in progress. */
        ALREADY = 7,
        /** Bad file descriptor. */
        BADF = 8,
        /** Bad message. */
        BADMSG = 9,
        /** Device or resource busy. */
        BUSY = 10,
        /** Operation canceled. */
        CANCELED = 11,
        /** No child processes. */
        CHILD = 12,
        /** Connection aborted. */
        CONNABORTED = 13,
        /** Connection refused. */
        CONNREFUSED = 14,
        /** Connection reset. */
        CONNRESET = 15,
        /** Resource deadlock would occur. */
        DEADLK = 16,
        /** Destination address required. */
        DESTADDRREQ = 17,
        /** Mathematics argument out of domain of function. */
        DOM = 18,
        /** Reserved. */
        DQUOT = 19,
        /** File exists. */
        EXIST = 20,
        /** Bad address. */
        FAULT = 21,
        /** File too large. */
        FBIG = 22,
        /** Host is unreachable. */
        HOSTUNREACH = 23,
        /** Identifier removed. */
        IDRM = 24,
        /** Illegal byte sequence. */
        ILSEQ = 25,
        /** Operation in progress. */
        INPROGRESS = 26,
        /** Interrupted function. */
        INTR = 27,
        /** Invalid argument. */
        INVAL = 28,
        /** I/O error. */
        IO = 29,
        /** Socket is connected. */
        ISCONN = 30,
        /** Is a directory. */
        ISDIR = 31,
        /** Too many levels of symbolic links. */
        LOOP = 32,
        /** File descriptor value too large. */
        MFILE = 33,
        /** Too many links. */
        MLINK = 34,
        /** Message too large. */
        MSGSIZE = 35,
        /** Reserved. */
        MULTIHOP = 36,
        /** Filename too long. */
        NAMETOOLONG = 37,
        /** Network is down. */
        NETDOWN = 38,
        /** Connection aborted by network. */
        NETRESET = 39,
        /** Network unreachable. */
        NETUNREACH = 40,
        /** Too many files open in system. */
        NFILE = 41,
        /** No buffer space available. */
        NOBUFS = 42,
        /** No such device. */
        NODEV = 43,
        /** No such file or directory. */
        NOENT = 44,
        /** Executable file format error. */
        NOEXEC = 45,
        /** No locks available. */
        NOLCK = 46,
        /** Reserved. */
        NOLINK = 47,
        /** Not enough space. */
        NOMEM = 48,
        /** No message of the desired type. */
        NOMSG = 49,
        /** Protocol not available. */
        NOPROTOOPT = 50,
        /** No space left on device. */
        NOSPC = 51,
        /** Function not supported. */
        NOSYS = 52,
        /** The socket is not connected. */
        NOTCONN = 53,
        /** Not a directory or a symbolic link to a directory. */
        NOTDIR = 54,
        /** Directory not empty. */
        NOTEMPTY = 55,
        /** State not recoverable. */
        NOTRECOVERABLE = 56,
        /** Not a socket. */
        NOTSOCK = 57,
        /** Not supported, or operation not supported on socket. */
        NOTSUP = 58,
        /** Inappropriate I/O control operation. */
        NOTTY = 59,
        /** No such device or address. */
        NXIO = 60,
        /** Value too large to be stored in data type. */
        OVERFLOW = 61,
        /** Previous owner died. */
        OWNERDEAD = 62,
        /** Operation not permitted. */
        PERM = 63,
        /** Broken pipe. */
        PIPE = 64,
        /** Protocol error. */
        PROTO = 65,
        /** Protocol not supported. */
        PROTONOSUPPORT = 66,
        /** Protocol wrong type for socket. */
        PROTOTYPE = 67,
        /** Result too large. */
        RANGE = 68,
        /** Read-only file system. */
        ROFS = 69,
        /** Invalid seek. */
        SPIPE = 70,
        /** No such process. */
        SRCH = 71,
        /** Reserved. */
        STALE = 72,
        /** Connection timed out. */
        TIMEDOUT = 73,
        /** Text file busy. */
        TXTBSY = 74,
        /** Cross-device link. */
        XDEV = 75,
        /** Extension: Capabilities insufficient. */
        NOTCAPABLE = 76,
    }
    //
    /** An event that occurred. */
    export class event {
        /** User-provided value that got attached to `subscription#userdata`. */
        userdata: userdata;
        /** If non-zero, an error that occurred while processing the subscription request. */
        error: errno;
        /* The type of the event that occurred. */
        type: eventtype;
        private __padding0: u16;
    }
    //
    /** An event that occurred when type is `eventtype.FD_READ` or `eventtype.FD_WRITE`. */
    export class rwevent extends event {
        /* The number of bytes available for reading or writing. */
        nbytes: filesize;
        /* The state of the file descriptor. */
        flags: eventrwflags;
        private __padding1: u32;
    }
    //
    /** The state of the file descriptor subscribed to with `eventtype.FD_READ` or `eventtype.FD_WRITE`. */
    export enum eventrwflags {
        /** The peer of this socket has closed or disconnected. */
        HANGUP = 1,
    }

    /** Type of a subscription to an event or its occurrence. */
    export enum eventtype {
        /** The time value of clock has reached the timestamp. */
        CLOCK = 0,
        /** File descriptor has data available for reading. */
        FD_READ = 1,
        //   /** File descriptor has capacity available for writing */
        FD_WRITE = 2,
    }
    // export type eventtype = u8;
    //
    // /** Exit code generated by a process when exiting. */
    // export type exitcode = u32;
    //
    // /** A file descriptor number. */
    export type fd = u32;
    //
    // /** File descriptor flags. */
    export enum fdflags {
        /** Append mode: Data written to the file is always appended to the file's end. */
        APPEND = 1,
        /** Write according to synchronized I/O data integrity completion. Only the data stored in the file is synchronized. */
        DSYNC = 2,
        /** Non-blocking mode. */
        NONBLOCK = 4,
        /** Synchronized read I/O operations. */
        RSYNC = 8,
        /** Write according to synchronized I/O file integrity completion. */
        SYNC = 16,
    }

    /** File descriptor attributes. */
    export class fdstat {
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
    //
    // /** Non-negative file size or length of a region within a file. */
    export type filesize = u64;

    /** File attributes. */
    export class filestat {
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
    export enum filetype {
        /** The type of the file descriptor or file is unknown or is different from any of the other types specified. */
        UNKNOWN = 0,
        /** The file descriptor or file refers to a block device inode. */
        BLOCK_DEVICE = 1,
        /** The file descriptor or file refers to a character device inode. */
        CHARACTER_DEVICE = 2,
        /** The file descriptor or file refers to a directory inode. */
        DIRECTORY = 3,
        /** The file descriptor or file refers to a regular file inode. */
        REGULAR_FILE = 4,
        /** The file descriptor or file refers to a datagram socket. */
        SOCKET_DGRAM = 5,
        /** The file descriptor or file refers to a byte-stream socket. */
        SOCKET_STREAM = 6,
        /** The file refers to a symbolic link inode. */
        SYMBOLIC_LINK = 7,
    }

    /** Which file time attributes to adjust. */
    export enum fstflags {
        /** Adjust the last data access timestamp to the value stored in `filestat#st_atim`. */
        SET_ATIM = 1,
        /** Adjust the last data access timestamp to the time of clock `clockid.REALTIME`. */
        SET_ATIM_NOW = 2,
        /** Adjust the last data modification timestamp to the value stored in `filestat#st_mtim`. */
        SET_MTIM = 4,
        /** Adjust the last data modification timestamp to the time of clock `clockid.REALTIME`. */
        SET_MTIM_NOW = 8,
    }


    /** File serial number that is unique within its file system. */
    export type inode = u64;

    /** A region of memory for scatter/gather reads. */
    export class iovec {
        /** The address of the buffer to be filled. */
        buf: usize;
        /** The length of the buffer to be filled. */
        buf_len: usize;
    }

    /** Number of hard links to an inode. */
    export type linkcount = u32;

    /** Flags determining the method of how paths are resolved. */
    export enum lookupflags {
        /** As long as the resolved path corresponds to a symbolic link, it is expanded. */
        SYMLINK_FOLLOW = 1,
    }

    /** Open flags. */
    export enum oflags {
        /** Create file if it does not exist. */
        CREAT = 1,
        /** Fail if not a directory. */
        DIRECTORY = 2,
        /** Fail if file already exists. */
        EXCL = 4,
        /** Truncate file to size 0. */
        TRUNC = 8,
    }

    // TODO: undocumented
    export enum preopentype {
        DIR = 0,
    }

    // TODO: undocumented
    export abstract class prestat {
        type: preopentype;
    }

    // TODO: undocumented
    export class dirprestat extends prestat {
        name_len: usize;
    }

    /** Flags provided to `sock_recv`. */
    export enum riflags {
        /** Returns the message without removing it from the socket's receive queue. */
        PEEK = 1,
        /** On byte-stream sockets, block until the full amount of data can be returned. */
        WAITALL = 2,
    }

    /** File descriptor rights, determining which actions may be performed. */
    export enum rights {
        /** The right to invoke `fd_datasync`. */
        FD_DATASYNC = 1,
        /** The right to invoke `fd_read` and `sock_recv`. */
        FD_READ = 2,
        /** The right to invoke `fd_seek`. This flag implies `rights.FD_TELL`. */
        FD_SEEK = 4,
        /** The right to invoke `fd_fdstat_set_flags`. */
        FD_FDSTAT_SET_FLAGS = 8,
        /** The right to invoke `fd_sync`. */
        FD_SYNC = 16,
        /** The right to invoke `fd_seek` in such a way that the file offset remains unaltered (i.e., `whence.CUR` with offset zero), or to invoke `fd_tell`). */
        FD_TELL = 32,
        /** The right to invoke `fd_write` and `sock_send`. If `rights.FD_SEEK` is set, includes the right to invoke `fd_pwrite`. */
        FD_WRITE = 64,
        /** The right to invoke `fd_advise`. */
        FD_ADVISE = 128,
        /** The right to invoke `fd_allocate`. */
        FD_ALLOCATE = 256,
        /** The right to invoke `path_create_directory`. */
        PATH_CREATE_DIRECTORY = 512,
        /** If `rights.PATH_OPEN` is set, the right to invoke `path_open` with `oflags.CREAT`. */
        PATH_CREATE_FILE = 1024,
        /** The right to invoke `path_link` with the file descriptor as the source directory. */
        PATH_LINK_SOURCE = 2048,
        /** The right to invoke `path_link` with the file descriptor as the target directory. */
        PATH_LINK_TARGET = 4096,
        /** The right to invoke `path_open`. */
        PATH_OPEN = 8192,
        /** The right to invoke `fd_readdir`. */
        FD_READDIR = 16384,
        /** The right to invoke `path_readlink`. */
        PATH_READLINK = 32768,
        /** The right to invoke `path_rename` with the file descriptor as the source directory. */
        PATH_RENAME_SOURCE = 65536,
        /** The right to invoke `path_rename` with the file descriptor as the target directory. */
        PATH_RENAME_TARGET = 131072,
        /** The right to invoke `path_filestat_get`. */
        PATH_FILESTAT_GET = 262144,
        /** The right to change a file's size (there is no `path_filestat_set_size`). If `rights.PATH_OPEN` is set, includes the right to invoke `path_open` with `oflags.TRUNC`. */
        PATH_FILESTAT_SET_SIZE = 524288,
        /** The right to invoke `path_filestat_set_times`. */
        PATH_FILESTAT_SET_TIMES = 1048576,
        /** The right to invoke `fd_filestat_get`. */
        FD_FILESTAT_GET = 2097152,
        /** The right to invoke `fd_filestat_set_size`. */
        FD_FILESTAT_SET_SIZE = 4194304,
        /** The right to invoke `fd_filestat_set_times`. */
        FD_FILESTAT_SET_TIMES = 8388608,
        /** The right to invoke `path_symlink`. */
        RIGHT_PATH_SYMLINK = 16777216,
        /** The right to invoke `path_remove_directory`. */
        PATH_REMOVE_DIRECTORY = 33554432,
        /** The right to invoke `path_unlink_file`. */
        PATH_UNLINK_FILE = 67108864,
        /** If `rights.FD_READ` is set, includes the right to invoke `poll_oneoff` to subscribe to `eventtype.FD_READ`. If `rights.FD_WRITE` is set, includes the right to invoke `poll_oneoff` to subscribe to `eventtype.FD_WRITE`. */
        POLL_FD_READWRITE = 134217728,
        /** The right to invoke `sock_shutdown`. */
        SOCK_SHUTDOWN = 268435456,
    }

    /** Flags returned by `sock_recv`. */
    export enum roflags {
        /** Message data has been truncated. */
        DATA_TRUNCATED = 1,
    }

    /** Which channels on a socket to shut down. */
    export enum sdflags {
        /** Disables further receive operations. */
        RD = 1,
        /** Disables further send operations. */
        WR = 2,
    }


    /** Flags provided to `sock_send`. */
    export enum siflags {
        // As there are currently no flags defined, it must be set to zero.
    }


    /** Signal condition. */
    export enum signal {
        /** Hangup. */
        HUP = 1,
        /** Terminate interrupt signal. */
        INT = 2,
        /** Terminal quit signal. */
        QUIT = 3,
        /** Illegal instruction. */
        ILL = 4,
        /** Trace/breakpoint trap. */
        TRAP = 5,
        /** Process abort signal. */
        ABRT = 6,
        /** Access to an undefined portion of a memory object. */
        BUS = 7,
        /** Erroneous arithmetic operation. */
        FPE = 8,
        /** Kill. */
        KILL = 9,
        /** User-defined signal 1. */
        USR1 = 10,
        /** Invalid memory reference. */
        SEGV = 11,
        /** User-defined signal 2. */
        USR2 = 12,
        /** Write on a pipe with no one to read it. */
        PIPE = 13,
        /** Alarm clock. */
        ALRM = 14,
        /** Termination signal. */
        TERM = 15,
        /** Child process terminated, stopped, or continued. */
        CHLD = 16,
        /** Continue executing, if stopped. */
        CONT = 17,
        /** Stop executing. */
        STOP = 18,
        /** Terminal stop signal. */
        TSTP = 19,
        /** Background process attempting read. */
        TTIN = 20,
        /** Background process attempting write. */
        TTOU = 21,
        /** High bandwidth data is available at a socket. */
        URG = 22,
        /** CPU time limit exceeded. */
        XCPU = 23,
        /** File size limit exceeded. */
        XFSZ = 24,
        /** Virtual timer expired. */
        VTALRM = 25,
        PROF = 26,
        WINCH = 27,
        POLL = 28,
        PWR = 29,
        /** Bad system call. */
        SYS = 30,
    }

    /** Flags determining how to interpret the timestamp provided in `subscription_t::u.clock.timeout. */
    export enum subclockflags {
        /** If set, treat the timestamp provided in `clocksubscription` as an absolute timestamp. */
        ABSTIME = 1
    }

    /** Subscription to an event. */
    export abstract class subscription {
        /** User-provided value that is attached to the subscription. */
        userdata: userdata;
        /** The type of the event to which to subscribe. */
        type: eventtype;
        private __padding0: u32;
    }

    /* Subscription to an event of type `eventtype.CLOCK`.**/
    export class clocksubscription extends subscription {
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
    export class fdsubscription extends subscription {
        /** The file descriptor on which to wait for it to become ready for reading or writing. */
        fd: fd;
    }

    /** Timestamp in nanoseconds. */
    export type timestamp = u64;

    /** User-provided value that may be attached to objects that is retained when extracted from the implementation. */
    export type userdata = u64;

    /** The position relative to which to set the offset of the file descriptor. */
    export enum whence {
        /** Seek relative to current position. */
        CUR = 0,
        /** Seek relative to end-of-file. */
        END = 1,
        /** Seek relative to start-of-file. */
        SET = 2,
    }
}
