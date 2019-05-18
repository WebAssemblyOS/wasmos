import { args_sizes_get, args_get } from "bindings/wasi";
import { StringUtils } from './utils';


//@ts-ignore
@global
export class CommandLine {
    private static args: Array<string> = new Array<string>();
    private static initialized: bool = false;

    private static init() {
        let count_and_size = memory.allocate(2 * sizeof<usize>());
        let ret = args_sizes_get(count_and_size, count_and_size + 4);
        if (ret != Wasi.errno.SUCCESS) {
            abort();
        }
        let count = load<usize>(count_and_size);
        let size = load<usize>(count_and_size + sizeof<usize>());
        let env_ptrs = memory.allocate((count + 1) * sizeof<usize>());
        let buf = memory.allocate(size);
        if (args_get(env_ptrs, buf) != Wasi.errno.SUCCESS) {
            abort();
        }
        for (let i: usize = 0; i < count; i++) {
            let env_ptr = load<usize>(env_ptrs + i * sizeof<usize>());
            let arg = StringUtils.fromCString(env_ptr);
            this.args.push(arg!);
        }
        memory.free(buf);
        memory.free(env_ptrs);
        this.initialized = true;
    }

    /**
     * Return all the command-line arguments
     */
    static all(): Array<String> {
        if (!this.initialized) {
            this.init();
        }
        return this.args;
    }

    /**
     * Return the i-th command-ine argument
     * @param i index
     */
    static get(i: usize): string | null {
        if (!this.initialized) {
            this.init();
        }
        let args_len: usize = this.args[0].length;
        if (i < args_len) {
            return this.args[i];
        }
        return null;
    }
}