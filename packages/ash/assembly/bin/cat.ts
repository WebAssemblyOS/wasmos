

export function main(args: string[]): void {
    if (args.length > 1) {
        for (let i: i32 = 1; i < args.length; i++) {
            let fd = fs.openForRead(args[i]);
            Console.log(fs.readString(fd))
        }
    }
}
