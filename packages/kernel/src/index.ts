// import { attachWorker } from "./fs";
import {Wasi} from "@wasmos/wasa/src/wasi"

export class Kernel implements Wasi.Wasi{
  worker: Worker;
  constructor(path: string = "worker.js") {
    this.worker = new Worker(path);
    // attachWorker(this.worker);
    this.worker.postMessage({ init: path });
    this.worker.onmessage = this.onmessage.bind(this);
  }

  onmessage(event: MessageEvent) {
    console.log(event.data);
  }

  static async create(path?: string): Promise<Kernel> {
    let kernel = new Kernel(path);

    return kernel;
  }
  
  args_get(argv: number, argv_buf: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  args_sizes_get(argc: number, argv_buf_size: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  clock_res_get(clock: Wasi.clockid, resolution: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  clock_time_get(clock: Wasi.clockid, precision: number, time: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  environ_get(environ: number, environ_buf: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  environ_sizes_get(environ_count: number, environ_buf_size: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_advise(fd: number, offset: number, len: number, advice: Wasi.advice): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_allocate(fd: number, offset: number, len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_close(fd: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_datasync(fd: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_fdstat_get(fd: number, buf: Wasi.fdstat): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_fdstat_set_flags(fd: number, flags: Wasi.fdflags): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_fdstat_set_rights(fd: number, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_filestat_get(fd: number, buf: Wasi.filestat): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_filestat_set_size(fd: number, size: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_filestat_set_times(fd: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_pread(fd: number, iovs: number, iovs_len: number, offset: number, nread: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_prestat_get(fd: number, buf: Wasi.prestat): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_prestat_dir_name(fd: number, path: number, path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_pwrite(fd: number, iovs: number, iovs_len: number, offset: number, nwritten: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_read(fd: number, iovs: number, iovs_len: number, nread: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_readdir(fd: number, buf: number, buf_len: number, cookie: number, buf_used: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  sock_send(sock: number, si_data: number, si_data_len: number, si_flags: Wasi.siflags, so_datalen: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_seek(fd: number, offset: number, whence: Wasi.whence, newoffset: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_sync(fd: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_tell(fd: number, newoffset: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_write(fd: number, iovs: number, iovs_len: number, nwritten: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_create_directory(fd: number, path: number, path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_filestat_get(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, buf: Wasi.filestat): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_filestat_set_times(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_link(old_fd: number, old_flags: Wasi.lookupflags, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_open(dirfd: number, dirflags: Wasi.lookupflags, path: number, path_len: number, oflags: Wasi.oflags, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights, fs_flags: Wasi.fdflags, fd: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_readlink(fd: number, path: number, path_len: number, buf: number, buf_len: number, buf_used: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_remove_directory(fd: number, path: number, path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_rename(old_fd: number, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_symlink(old_path: number, old_path_len: number, fd: number, new_path: number, new_path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  path_unlink_file(fd: number, path: number, path_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  poll_oneoff(in_: number, out: number, nsubscriptions: number, nevents: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  proc_exit(rval: number): void {
    throw new Error("Method not implemented.");
  }
  proc_raise(sig: Wasi.signal): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  random_get(buf: number, buf_len: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  sched_yield(): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  sock_recv(sock: number, ri_data: number, ri_data_len: number, ri_flags: Wasi.riflags, ro_datalen: number, ro_flags: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  sock_shutdown(sock: number, how: Wasi.sdflags): Wasi.errno {
    throw new Error("Method not implemented.");
  }
  fd_renumber(from: number, to: number): Wasi.errno {
    throw new Error("Method not implemented.");
  }
}
export * from "./process";
