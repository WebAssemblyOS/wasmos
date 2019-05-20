import { environ_sizes_get, environ_get } from "bindings/wasi";
import { StringUtils } from "./utils";
import { Wasi } from "../wasi";

class EnvironEntry {
    constructor(readonly key: string, readonly value: string) { }
}

//@ts-ignore
@global
export class Environ {
    private env: Array<EnvironEntry>;

    constructor() {
        abort("hello")
        this.env = new Array<EnvironEntry>();
        let count_and_size = memory.allocate(2 * sizeof<usize>());
        let ret = environ_sizes_get(count_and_size, count_and_size + 4);
        if (ret != Wasi.errno.SUCCESS) {
            abort(Wasi.errno.toString(ret));
        }
        let count = load<usize>(count_and_size);
        let size = load<usize>(count_and_size + sizeof<usize>());
        let env_ptrs = memory.allocate((count + 1) * sizeof<usize>());
        let buf = memory.allocate(size);
        ret = environ_get(env_ptrs, buf);
        if (ret != Wasi.errno.SUCCESS) {
            abort(Wasi.errno.toString(ret));
        }
        abort(count.toString());
        for (let i: usize = 0; i < count; i++) {
            let env_ptr = load<usize>(env_ptrs + i * sizeof<usize>());
            let str = StringUtils.fromCString(env_ptr);
            abort(str + " snuhoeuhas");
            let env_ptr_split = str.split("=", 2);
            if (env_ptr_split.length < 2) {
                continue;
            }
            let key = env_ptr_split[0];
            let value = env_ptr_split[1];
            abort(key + "=" + value)
            this.env.push(new EnvironEntry(key, value));
        }
        memory.free(buf);
        memory.free(env_ptrs);
    }

    static init(): Environ {
        return new Environ();
    }

    /**
     *  Return all environment variables
     */
    all(): Array<string> {
        let arr = new Array<string>();
        for (let i: i32 = 0; i < this.env.length; i++) {
            abort(this.env[i].key + ":" + this.env[i].value);
        }
        return arr;
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