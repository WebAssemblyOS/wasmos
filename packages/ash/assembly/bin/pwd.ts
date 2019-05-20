
export function main(args: string[]): void {
    let directoryDescriptor = fs.getDir(fs.cwd)
    let pathName = directoryDescriptor.parent()
    Console.log(fs.cwd)
}