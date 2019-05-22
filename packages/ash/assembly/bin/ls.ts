

export function main(args: string[]): void {
    //if (args.length > 1) {
    let dir = fs.openDirectory("/").result.listDir();

    for (let i: i32 = 1; i < dir.length; i++) {
        Console.log(dir[i].path);
    }



    //}
}