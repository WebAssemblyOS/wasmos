import { join } from "../../../assemblyscript/assembly/wasa/mock/path";

export function main(args: string[]): void {
    // args[1] is the file I'm looking for
    // console.log(full path) if it exists, nothing if it doesn't find it 
    let paths = Environ.get("$PATH").split(":");
    let filename = args[1];
    while (paths.length > 0) {
        let folder = paths.pop();
        let path = join([folder, filename]);
        let result = fs.openFile(path);
        log<string>(path);
        if (result.failed) {
            continue;
        } else {
            Console.log(path);
            break;
        }
    }
}