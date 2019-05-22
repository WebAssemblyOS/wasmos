import { FileSystem } from "../../../assemblyscript/assembly/wasa/fs/fs"
import { Wasi } from "../../../assemblyscript/assembly/wasi"
import { WasiResult } from '../../../assemblyscript/assembly/wasi/index';

//@ts-ignore
@global
export function main(args: string[]): void {
    let console = Console.init();
    let fs = FileSystem.Default();
    if (args.length > 1) {
        let dir = fs.openDirectory(args[1]);
        let res = dir.result.firstEntry().error
        console.log(res.toString())
    }
}
