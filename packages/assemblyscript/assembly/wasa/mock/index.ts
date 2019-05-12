// The entry file of your WebAssembly module.

export * from "./fs";
export * from "./random";
export * from "./process";
export * from "./console";



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

export class Performance {
  static now(): f64 {
    let time_ptr = memory.allocate(8);
    let res_ts = load<u64>(time_ptr);
    memory.free(time_ptr);
    return res_ts as f64;
  }
}


export class EnvironEntry {
  constructor(readonly key: string, readonly value: string) { }
}

export class Environ {
  env: Array<EnvironEntry> = new Array<EnvironEntry>();

  add(key: string, value: string): void {
    this.env.push(new EnvironEntry(key, value));
  }

  /**
   *  Return all environment variables
   */
  all(): Array<EnvironEntry> {
    return this.env;
  }

  /**
   * Return the value for an environment variable
   * @param key environment variable name
   */
  get(key: string): string | null {
    for (let i = 0, j = this.env.length; i < j; i++) {
      if (this.env[i].key == key) {
        return this.env[i].value;
      }
    }
    return null;
  }
}
//@ts-ignore
@global
export class CommandLine {
  static _args: Array<string> = new Array<string>();

  static push(item: string): void {
    this._args.push(item);
  }

  /**
   * Return all the command-line arguments
   */
  static all(): Array<string> {
    return this._args;
  }

  /**
   * Return the i-th command-ine argument
   * @param i index
   */
  static get(i: usize): string | null {
    let args_len: usize = this._args[0].length;
    if (i < args_len) {
      return this._args[i];
    }
    return null;
  }

  get args(): Array<string> {
    return CommandLine._args;
  }
  /**
   * Deletes arguments
   */
  static reset(): void {
    while (this._args.length > 0) {
      this._args.pop();
    }
  }
}

const newLine: u8 = 10;

export class StringUtils {
  static isNewLine(ptr: usize): boolean {
    return load<u8>(ptr) == newLine;
  }

  static fromCString(cstring: usize, max: usize = 4096): string | null {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
    }
    if (size > max) {
      return null;
    }
    return String.fromUTF8(cstring, size);
  }

  static fromCStringTilNewLine(cstring: usize, max: usize): string | null {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
      if (this.isNewLine(cstring + size - 1)) {
        break;
      }
    }
    if (size > max) {
      return null;
    }
    return String.fromUTF8(cstring, size);
  }
}

