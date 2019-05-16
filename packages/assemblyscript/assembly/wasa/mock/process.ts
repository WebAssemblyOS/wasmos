import { fd } from "./fs";
import { Wasi } from "../../wasi";

//@ts-ignore
@global
export class Process {
    static _singleton: Process;

    constructor(cwd: fd) {
        this._cwd = cwd;
        Process._singleton = this;
    }
    _cwd: fd;
    /**
     * Cleanly terminate the current process
     * @param status exit code
     */
    static exit(status: Wasi.errno): void {
        if (status != Wasi.errno.SUCCESS) {
            abort("Error ");
        }
        abort();
    }

    static get cwd(): fd {
        return Process._singleton._cwd;
    }

    static set cwd(fd: fd) {
        Process._singleton._cwd = fd;
    }
}