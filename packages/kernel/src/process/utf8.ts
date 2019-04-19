import { toUint8Array, fromUTF8Array } from "@wasmos/utils/src";
type _Map<K, V> = Map<K, V>;

export namespace UTF8 {
  toUint8Array;

  export class String {
    data: Uint8Array;

    constructor(str: string | Uint8Array) {
      if (typeof str === "string") {
        this.data = toUint8Array(str);
      } else {
        this.data = str;
      }
    }

    get size(): number {
      return this.data.length + 1;
    }

    get str(): string {
      return fromUTF8Array(this.data);
    }
  }

  export class Array {
    args: UTF8.String[] = [];

    constructor(strs: string[] = []) {
      strs.map(str => {
        this.push(str);
      });
    }

    push(arg: string): void {
      this.args.push(new UTF8.String(arg));
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
      let array = new Uint8Array(this.size);
      this.ptrs.forEach((ptr, idx, ptrs) => {
        array.set(this.args[idx].data, ptr);
      });
      return array;
    }

    get ptrs(): Uint32Array {
      let ptrs = new Uint32Array(this.length);
      this.args.reduce((acc, cur, idx) => {
        ptrs[idx] = acc;
        return acc + cur.size;
      }, 0);
      return ptrs;
    }
  }

  /*
   * Creates a map by making an array of key value pairs joi
   */
  export class Map extends UTF8.Array {
    static fromMap(map: _Map<string, string>): UTF8.Array {
      let res = new Map();
      map.forEach((value, key) => {
        res.push(`${key}=${value}`);
      });
      return res;
    }
  }
}
