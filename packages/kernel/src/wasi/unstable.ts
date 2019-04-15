

import { Wasi } from "./wasi";
import { ASImport } from "@wasmos/assemblyscript/src";
type usize = number;
type u32 = number;
type u16 = number;
type u64 = number;




export class Wasi_unstable extends ASImport implements Wasi.Wasi {

    constructor(public kernel: Wasi.Wasi) {
        super();
    }

    args_get(argv: number, argv_buf: number): Wasi.errno {
        return this.kernel.args_get(argv, argv_buf);
    }
    args_sizes_get(argc: number, argv_buf_size: number): Wasi.errno {
        return this.kernel.args_sizes_get(argc, argv_buf_size)
    }
    clock_res_get(clock: Wasi.clockid, resolution: number): Wasi.errno {
        return this.kernel.clock_res_get(clock, resolution);
    }
    clock_time_get(clock: Wasi.clockid, precision: number, time: number): Wasi.errno {
        return this.kernel.clock_time_get(clock, precision, time);
    }
    environ_get(environ: number, environ_buf: number): Wasi.errno {
        return this.kernel.environ_get(environ, environ_buf);
    }
    environ_sizes_get(environ_count: number, environ_buf_size: number): Wasi.errno {
        return this.kernel.environ_sizes_get(environ_count, environ_buf_size);
    }
    fd_advise(fd: number, offset: number, len: number, advice: Wasi.advice): Wasi.errno {
        return this.kernel.fd_advise(fd, offset, len, advice);
    }
    fd_allocate(fd: number, offset: number, len: number): Wasi.errno {
        return this.kernel.fd_allocate(fd, offset, len);
    }
    fd_close(fd: number): Wasi.errno {
        return this.kernel.fd_close(fd);
    }
    fd_datasync(fd: number): Wasi.errno {
        return this.kernel.fd_datasync(fd);
    }
    fd_fdstat_get(fd: number, buf: Wasi.fdstat): Wasi.errno {
        return this.kernel.fd_fdstat_get(fd, buf);
    }
    fd_fdstat_set_flags(fd: number, flags: Wasi.fdflags): Wasi.errno {
        return this.kernel.fd_fdstat_set_flags(fd, flags);
    }
    fd_fdstat_set_rights(fd: number, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights): Wasi.errno {
        return this.kernel.fd_fdstat_set_rights(fd, fs_rights_base, fs_rights_inheriting);
    }
    fd_filestat_get(fd: number, buf: Wasi.filestat): Wasi.errno {
        return this.kernel.fd_filestat_get(fd, buf);
    }
    fd_filestat_set_size(fd: number, size: number): Wasi.errno {
        return this.kernel.fd_filestat_set_size(fd, size);
    }
    fd_filestat_set_times(fd: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
        return this.kernel.fd_filestat_set_times(fd, st_atim, st_mtim, fstflags);
    }
    fd_pread(fd: number, iovs: number, iovs_len: number, offset: number, nread: number): Wasi.errno {
        return this.kernel.fd_pread(fd, iovs, iovs_len, offset, nread);
    }
    fd_prestat_get(fd: number, buf: Wasi.prestat): Wasi.errno {
        return this.kernel.fd_prestat_get(fd, buf);
    }
    fd_prestat_dir_name(fd: number, path: number, path_len: number): Wasi.errno {
        return this.kernel.fd_prestat_dir_name(fd, path, path_len);
    }
    fd_pwrite(fd: number, iovs: number, iovs_len: number, offset: number, nwritten: number): Wasi.errno {
        return this.kernel.fd_pwrite(fd, iovs, iovs_len, offset, nwritten);
    }
    fd_read(fd: number, iovs: number, iovs_len: number, nread: number): Wasi.errno {
        return this.kernel.fd_read(fd, iovs, iovs_len, nread);
    }
    fd_readdir(fd: number, buf: number, buf_len: number, cookie: number, buf_used: number): Wasi.errno {
        return this.kernel.fd_readdir(fd, buf, buf_len, cookie, buf_used);
    }
    sock_send(sock: number, si_data: number, si_data_len: number, si_flags: Wasi.siflags, so_datalen: number): Wasi.errno {
        return this.kernel.sock_send(sock, si_data, si_data_len, si_flags, so_datalen);
    }
    fd_seek(fd: number, offset: number, whence: Wasi.whence, newoffset: number): Wasi.errno {
        return this.kernel.fd_seek(fd, offset, whence, newoffset);
    }
    fd_sync(fd: number): Wasi.errno {
        return this.kernel.fd_sync(fd);
    }
    fd_tell(fd: number, newoffset: number): Wasi.errno {
        return this.kernel.fd_tell(fd, newoffset);
    }
    fd_write(fd: number, iovs: number, iovs_len: number, nwritten: number): Wasi.errno {
        return this.kernel.fd_write(fd, iovs, iovs_len, nwritten);
    }
    path_create_directory(fd: number, path: number, path_len: number): Wasi.errno {
        return this.kernel.path_create_directory(fd, path, path_len);
    }
    path_filestat_get(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, buf: Wasi.filestat): Wasi.errno {
        return this.kernel.path_filestat_get(fd, flags, path, path_len, buf);
    }
    path_filestat_set_times(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
        return this.kernel.path_filestat_set_times(fd, flags, path, path_len, st_atim, st_mtim, fstflags);
    }
    path_link(old_fd: number, old_flags: Wasi.lookupflags, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
        return this.kernel.path_link(old_fd, old_flags, old_path, old_path_len, new_fd, new_path, new_path_len);
    }
    path_open(dirfd: number, dirflags: Wasi.lookupflags, path: number, path_len: number, oflags: Wasi.oflags, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights, fs_flags: Wasi.fdflags, fd: number): Wasi.errno {
        return this.kernel.path_open(dirfd, dirflags, path, path_len, oflags, fs_rights_base, fs_rights_inheriting, fs_flags, fd);
    }
    path_readlink(fd: number, path: number, path_len: number, buf: number, buf_len: number, buf_used: number): Wasi.errno {
        return this.kernel.path_readlink(fd, path, path_len, buf, buf_len, buf_used);
    }
    path_remove_directory(fd: number, path: number, path_len: number): Wasi.errno {
        return this.kernel.path_remove_directory(fd, path, path_len);
    }
    path_rename(old_fd: number, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
        return this.kernel.path_rename(old_fd, old_path, old_path_len, new_fd, new_path, new_path_len);
    }
    path_symlink(old_path: number, old_path_len: number, fd: number, new_path: number, new_path_len: number): Wasi.errno {
        return this.kernel.path_symlink(old_path, old_path_len, fd, new_path, new_path_len);
    }
    path_unlink_file(fd: number, path: number, path_len: number): Wasi.errno {
        return this.kernel.path_unlink_file(fd, path, path_len);
    }
    poll_oneoff(in_: number, out: number, nsubscriptions: number, nevents: number): Wasi.errno {
        return this.kernel.poll_oneoff(in_, out, nsubscriptions, nevents);
    }
    proc_exit(rval: number): void {
        return this.kernel.proc_exit(rval);
    }
    proc_raise(sig: Wasi.signal): Wasi.errno {
        return this.kernel.proc_raise(sig);
    }
    random_get(buf: number, buf_len: number): Wasi.errno {
        return this.kernel.random_get(buf, buf_len);
    }
    sched_yield(): Wasi.errno {
        return this.kernel.sched_yield();
    }
    sock_recv(sock: number, ri_data: number, ri_data_len: number, ri_flags: Wasi.riflags, ro_datalen: number, ro_flags: number): Wasi.errno {
        return this.kernel.sock_recv(sock, ri_data, ri_data_len, ri_flags, ro_datalen, ro_flags);
    }
    sock_shutdown(sock: number, how: Wasi.sdflags): Wasi.errno {
        return this.kernel.sock_shutdown(sock, how);
    }
    fd_renumber(from: number, to: number): Wasi.errno {
        return this.kernel.fd_renumber(from, to);
    }


}
