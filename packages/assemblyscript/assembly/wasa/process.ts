import { fd } from "./fs";
import { Wasi } from "../wasi";
import { proc_exit } from "bindings/wasi";

//@ts-ignore
@global

export class Process {
    /**
     * Cleanly terminate the current process
     * @param status exit code
     */
    static exit(status: u32): void {
        proc_exit(status)
    }
}