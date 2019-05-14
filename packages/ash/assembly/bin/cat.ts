

export function main(args: string[]): void {
    if (args.length > 1) {
        for (let i: i32 = 1; i < args.length; i++) {
            let file = fs.openFile(args[i]);
            if (file.failed) {
                Console.error("cat: " + args[i] + ": No such file or directory");
                continue;
            }
            Console.log(file.result.readString().result);
        }
    }
}
