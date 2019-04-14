import { Process, Env } from "./process";
import * as Wasi from "@wasmos/wasa/src/wasi";
import { toUint8Array, fromUTF8Array } from "@wasmos/wasa/src";
import { loader, ASImport } from "@wasmos/assemblyscript/src";

export class Arg {
  data: Uint8Array;

  constructor(str: string) {
    this.data = toUint8Array(str);
  }

  get size(): number {
    return this.data.length + 1
  }

  get str(): string {
    return fromUTF8Array(this.data);
  }
}

export class Args {
  args: Arg[] = new Array();


  push(arg: string): void {
    this.args.push(new Arg(arg));
  }
  /**
   * Sums the sizes of each argument
   */
  get size(): number {
    return this.args.reduce((acc, curr) => {
      return acc + curr.size;
    }, 0);
  }

  get length(): number {
    return this.args.length;
  }

  get bytes(): Uint8Array {
    // TODO: Find the right type
    let array = new Uint8Array(this.size)
    this.ptrs.forEach((ptr, idx, ptrs) => {
      array.set(this.args[idx].data, ptr)
    });
    return array;
  }

  get ptrs(): Uint32Array {
    let ptrs = new Uint32Array(this.length);
    this.args.reduce((acc, cur, idx) => {
      ptrs[idx] = acc;
      return acc + cur.size
    }, 0);
    return ptrs;
  }
}

export class ASProcess extends Process implements Wasi.Wasi {
  instance: loader.ASInstance;
  module: WebAssembly.Module = null;
  stdout = Array<string>();
  status: number;
  binName: string;
  binpath: string;
  UT8Args: Args = new Args();
  _memory: Uint8Array;

  constructor(public args: string[], env?: Env) {
    super(args, env);
    args.forEach(arg => this.UT8Args.push(arg));
  }

  readStdout(s: string | number): void {
    this.stdout.push(typeof s === "string" ? s : this.readString(s));
  }

  readString(x: number): string {
    return this.instance.memory.getString(x);
  }

  get U8(): Uint8Array {
    return this.instance ? this.instance.memory.U8 : this._memory;
  }

  get U32(): Uint32Array {
    return this.instance ? this.instance.memory.U32 : Uint32Array.from(this._memory);
  }



  start(): Process {
    var res;
    try {
      let imports = ASImport.createImport(this.env);
      this.instance = loader.instantiate(this.module, imports);
      res = (<any>this.instance)._main();
    } catch (Error) {
      res = 1;
    }
    this.status = res;
    return this;
  }

  store32(idx: number, value: number): void {
    this.U32[idx >> 2] = value;
  }

  set32(idx: number, array: Uint8Array) {
    this.U8.set(array, idx >> 2)
  }



  args_get(argv: number, argv_buf: number): Wasi.errno {
    // this.set32(argv, this)

    return Wasi.errno.SUCCESS;
  }

  args_sizes_get(argc: number, argv_buf_size: number): Wasi.errno {
    this.store32(argc, this.UT8Args.length);
    this.store32(argv_buf_size, this.UT8Args.size);
    return Wasi.errno.SUCCESS;
  }

  clock_res_get(clock: Wasi.clockid, resolution: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  clock_time_get(clock: Wasi.clockid, precision: number, time: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  environ_get(environ: number, environ_buf: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  environ_sizes_get(environ_count: number, environ_buf_size: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_advise(fd: number, offset: number, len: number, advice: Wasi.advice): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_allocate(fd: number, offset: number, len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_close(fd: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_datasync(fd: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_fdstat_get(fd: number, buf: Wasi.fdstat): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_fdstat_set_flags(fd: number, flags: Wasi.fdflags): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_fdstat_set_rights(fd: number, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_filestat_get(fd: number, buf: Wasi.filestat): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_filestat_set_size(fd: number, size: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_filestat_set_times(fd: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_pread(fd: number, iovs: number, iovs_len: number, offset: number, nread: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_prestat_get(fd: number, buf: Wasi.prestat): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_prestat_dir_name(fd: number, path: number, path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_pwrite(fd: number, iovs: number, iovs_len: number, offset: number, nwritten: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_read(fd: number, iovs: number, iovs_len: number, nread: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_readdir(fd: number, buf: number, buf_len: number, cookie: number, buf_used: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  sock_send(sock: number, si_data: number, si_data_len: number, si_flags: Wasi.siflags, so_datalen: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_seek(fd: number, offset: number, whence: Wasi.whence, newoffset: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_sync(fd: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_tell(fd: number, newoffset: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_write(fd: number, iovs: number, iovs_len: number, nwritten: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_create_directory(fd: number, path: number, path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_filestat_get(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, buf: Wasi.filestat): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_filestat_set_times(fd: number, flags: Wasi.lookupflags, path: number, path_len: number, st_atim: number, st_mtim: number, fstflags: Wasi.fstflags): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_link(old_fd: number, old_flags: Wasi.lookupflags, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_open(dirfd: number, dirflags: Wasi.lookupflags, path: number, path_len: number, oflags: Wasi.oflags, fs_rights_base: Wasi.rights, fs_rights_inheriting: Wasi.rights, fs_flags: Wasi.fdflags, fd: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_readlink(fd: number, path: number, path_len: number, buf: number, buf_len: number, buf_used: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_remove_directory(fd: number, path: number, path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_rename(old_fd: number, old_path: number, old_path_len: number, new_fd: number, new_path: number, new_path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_symlink(old_path: number, old_path_len: number, fd: number, new_path: number, new_path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  path_unlink_file(fd: number, path: number, path_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  poll_oneoff(in_: number, out: number, nsubscriptions: number, nevents: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  proc_exit(rval: number): void {
  }
  proc_raise(sig: Wasi.signal): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  random_get(buf: number, buf_len: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  sched_yield(): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  sock_recv(sock: number, ri_data: number, ri_data_len: number, ri_flags: Wasi.riflags, ro_datalen: number, ro_flags: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  sock_shutdown(sock: number, how: Wasi.sdflags): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }
  fd_renumber(from: number, to: number): Wasi.errno {
    return Wasi.errno.SUCCESS;
  }

}
