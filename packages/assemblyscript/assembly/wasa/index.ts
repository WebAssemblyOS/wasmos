
import * as mock from "./mock";
import { Wasi } from '../../../kernel/src/wasi/wasi';

class Tuple<T1, T2> {
    constructor(public first: T1, public second: T2) { }
}


export class WasiResult<T> extends Tuple<T | null, Wasi.errno> {
    constructor(first: T | null, second: Wasi.errno = Wasi.errno.SUCCESS) {
        super(first, second);
    }
    get failed(): boolean {
        return this.error != Wasi.errno.SUCCESS;
    }

    get error(): Wasi.errno {
        return this.second
    }

    get result(): T {
        return this.first!;
    }

    static resolve<T>(result: T): WasiResult<T> {
        return new WasiResult<T>(result)
    }

    static fail<T>(err: Wasi.errno): WasiResult<T> {
        return new WasiResult<T>(null, err);
    }


    static void<T>(res: Wasi.errno): WasiResult<T> {
        return this.fail(res);
    }
}

export { mock };
