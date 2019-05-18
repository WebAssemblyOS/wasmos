import { fd } from "./fs";
import { Wasi } from "../../wasi";

//@ts-ignore
@global
export class Process {
    static _singleton: Process;

    // Error status flag 
    public static error_flag: Wasi.errno;

    constructor(cwd: fd) {
        this._cwd = cwd;
        Process.error_flag = Wasi.errno.SUCCESS;
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

    /**
     * Set Process error flag without aborting
     * @param status exit code
     */
    static error(status: Wasi.errno): void {
        Process.error_flag = status;
    }

    



    static get cwd(): fd {
        return Process._singleton._cwd;
    }

    static set cwd(fd: fd) {
        Process._singleton._cwd = fd;
    }
}