export function main(args: string[]): void {
    if(args.length > 1) {
        for (let i: i32 = 1; i < args.length; i++) {
            fs.close(fs.openForRead(args[i]).result.fd);
        }
    }
}