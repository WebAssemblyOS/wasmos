
export function main(args: string[]): void {
    let directoryDescriptor = fs.getDir(fs.cwd)
    let res = fs.getDir(fs.cwd)
    if (!res.failed) {
        let dd = res.result;
        let pathName = dd.path;
        Console.log(pathName);
    }

}