

export function main(args: string[]): void {
    let dirname: string;
    if (args.length > 2) {
        dirname = args[1];
    } else {
        dirname = fs.getDir(fs.cwd).result.file!.path;
    }

    let dir = fs.openDirectory(dirname).result.listDir();
    let _dirs: string[] = new Array<string>();

    for (let i: i32 = 0; i < dir.length; i++) {
        _dirs.push(dir[i].path);
    }

    Console.log(_dirs.join(" "));
}