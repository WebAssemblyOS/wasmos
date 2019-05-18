
import * as mock from "./mock";
import { Wasi } from '../wasi';

class Tuple<T1, T2> {
    constructor(public first: T1, public second: T2) { }
}

/** Simple generic reference for wrapping non reference types*/
export class Ref<T>{
    constructor(public val: T) { }
}

//@ts-ignore
@global
/**
 * Helper class for dealing with errors.
 */
export class WasiResult<T> extends Tuple<Ref<T> | null, Wasi.errno> {
    /**
     * 
     * @param first 
     * @param second 
     * @param isReference: bool - Whether the value passed to first is T or Ref<T>
     */
    private constructor(first: Ref<T> | null,
        second: Wasi.errno = Wasi.errno.SUCCESS,
        private isReference: bool = true) {
        super(first, second);
    }

    /**
     * Tests if the error is not a success.
     */
    get failed(): boolean {
        return this.error != Wasi.errno.SUCCESS;
    }

    get error(): Wasi.errno {
        return this.second
    }

    get result(): T {
        if (this.isReference) {
            return changetype<T>(this.first!);
        }
        return (this.first!).val;
    }

    static resolve<T>(result: T): WasiResult<T> {
        let res: Ref<T> = isInteger(result) ? new Ref<T>(result) : changetype<Ref<T>>(result);
        return new WasiResult<T>(res, Wasi.errno.SUCCESS, isReference<T>(result));
    }

    static fail<T>(err: Wasi.errno): WasiResult<T> {
        return new WasiResult<T>(null, err);
    }

    /**
     * Special case where there is no result type just the error.
     * @param res error
     */
    static void(res: Wasi.errno): WasiResult<void> {
        return this.fail<void>(res);
    }
}

export { mock };
