import { clock_res_get } from "bindings/wasi";

export class Performance {
  static now(): f64 {
    let time_ptr = memory.allocate(8);
    clock_res_get(Wasi.clockid.MONOTONIC, time_ptr);
    let res_ts = load<u64>(time_ptr);
    memory.free(time_ptr);
    return res_ts as f64;
  }
}