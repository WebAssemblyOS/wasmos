import { FileSystem } from "../../../assemblyscript/assembly/wasa/fs/fs"
import { Wasi } from "../../../assemblyscript/assembly/wasi"

//@ts-ignore
@global
export function main(args: string[]): void {
    let console = Console.init();
    let fs = FileSystem.Default();
    if (args.length > 1) {
        for (let i: i32 = 1; i < args.length; i++) {
            let file = fs.openFile(args[i]);
            if (file.failed) {
                Console.error("cat: " + args[i] + ": No such file or directory");
                console.error("cat: " + args[i] + ": No such file or directory");
                continue;
            }
            console.log(file.result.readString().result);
        }
    }
}
