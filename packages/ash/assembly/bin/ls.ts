import { dirprestat } from "bindings/wasi";


export function main(args: string[]): void {
    //if (args.length > 1) {
    let dir = fs.openDirectory("/").result.listDir();
    let _dirs: string[] = new Array<string>();
    let newLine: bool = true;

    for (let i: i32 = 0; i < dir.length; i++) {
        _dirs.push(dir[i].path);
        //log<string>(dir[i].path);
    }

    Console.write(_dirs.join(" "), newLine);


    //}
}