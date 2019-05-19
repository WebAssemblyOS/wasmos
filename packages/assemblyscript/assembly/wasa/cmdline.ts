import { args_sizes_get, args_get } from "bindings/wasi";
import { StringUtils } from './utils';
import { Wasi } from "../wasi";

//@ts-ignore
@global
export class CommandLine {
    private args: Array<string>;
    constructor() {
        this.args = new Array<string>();
        let count_and_size = memory.allocate(2 * sizeof<usize>());
        let ret = args_sizes_get(count_and_size, count_and_size + 4);
        if (ret != Wasi.errno.SUCCESS) {
            abort("error was " + ret.toString());
        }
        let count = load<usize>(count_and_size);
        let size = load<usize>(count_and_size + sizeof<usize>());
        let env_ptrs = memory.allocate((count + 1) * sizeof<usize>());
        let buf = memory.allocate(size);
        ret = args_get(env_ptrs, buf);
        if (ret != Wasi.errno.SUCCESS) {
            abort("error was " + ret.toString());

        }
        for (let i: usize = 0; i < count; i++) {
            let env_ptr = load<usize>(env_ptrs + i * sizeof<usize>());
            let arg = StringUtils.fromCString(env_ptr);
            this.args.push(arg!);
        }
        memory.free(buf);
        memory.free(env_ptrs);
    }

    static init(): CommandLine {
        return new CommandLine();
    }

    /**
     * Return all the command-line arguments
     */
    all(): Array<String> {
        return this.args;
    }

    /**
     * Return the i-th command-ine argument
     * @param i index
     */
    get(i: usize): string | null {
        let args_len: usize = this.args[0].length;
        if (i < args_len) {
            return this.args[i];
        }
        return null;
    }
}