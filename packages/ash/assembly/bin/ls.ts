import { FileSystem } from "../../../assemblyscript/assembly/wasa/fs/fs"
import { Wasi } from "../../../assemblyscript/assembly/wasi"
import { WasiResult } from '../../../assemblyscript/assembly/wasi/index';

//@ts-ignore
@global
export function main(args: string[]): void {
    let console = Console.init();
    let fs = FileSystem.Default();
    if (args.length > 1) {
        let dir = fs.openDirectory(".");
        let dir2 = fs.openDirectoryAt(dir.result.fd, args[1])
        let res = dir2.result.firstEntry().result
        for (let i: i32 = 0; i < res.length; i++) {
            console.log(res[i].path)
        }
        // console.log(res.toString())
    }
}
