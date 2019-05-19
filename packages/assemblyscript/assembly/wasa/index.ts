
import "allocator/arena";
import { Console } from './console';
// export * from "./fs";
// export * from "./random";
// export * from "./process";
export * from "./console";
export * from "./environ";
export * from "./cmdline";
// export * from "./date";
// export * from "./performance";
// Any Env overrides
// import { main } from "../../../ash/assembly/bin/echo";
import { proc_exit } from 'bindings/wasi';



// https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/env.ts
// https://github.com/AssemblyScript/assemblyscript/issues/388
//@ts-ignore
@global
export function wasiabort(
    message: string | null = "",
    fileName: string | null = "",
    lineNumber: u32 = 0,
    columnNumber: u32 = 0
): void {
    let console = Console.init()
    console.error(message!);
    proc_exit(1)
}


export function _start(): void {
    let console = Console.init()
    let cmd = CommandLine.init();
    let cmds = cmd.all();
    // abort(cmds.join(" "));
    // console.log(cmd.get(1))
    // console.log(cmd.all()[1]);
    //@ts-ignore
    main(cmds);
}