
export class Date {
  /**
   * Return the current timestamp, as a number of milliseconds since the epoch
   */
  static now(): f64 {
    let time_ptr = memory.allocate(8);
    let unix_ts = load<u64>(time_ptr);
    memory.free(time_ptr);
    return (unix_ts as f64) / 1000.0;
  }
}