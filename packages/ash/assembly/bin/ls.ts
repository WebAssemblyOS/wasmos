import { dirprestat } from "bindings/wasi";


export function main(args: string[]): void {
    let dir = fs.openDirectory("/").result.listDir();
    let _dirs: string[] = new Array<string>();

    for (let i: i32 = 0; i < dir.length; i++) {
        _dirs.push(dir[i].path);
        log<string>(dir[i].path);
    }
    log<string>(_dirs.join(" "));
    Console.log(_dirs.join(" "));
}