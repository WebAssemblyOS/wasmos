

export function main(args: string[]): void {
    if (args.length > 1) {
        for (let i: usize = 1; i < args.length; i++) {
            let fd = fs.open(args[i]);
            Console.log(fs.readString(fd))
        }
    }
}
