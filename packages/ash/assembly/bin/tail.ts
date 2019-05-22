export function main(args: string[]): void {
    if (args.length > 1) {
        for (let i: i32 = 1; i < args.length; i++) {
            let file = fs.openFile(args[i]);
            if (file.failed) {
                Console.error("tail: " + args[i] + ": No such file or directory");
                continue;
            }
            var lines = file.result.readString().result.split('\n');
            if (lines.length < 10) {
                Console.log(lines.toString());
            } else {
                var counter = 0;
                var needsRemoved = lines.length - 10;
                while (counter < needsRemoved) {
                    lines.pop();
                }
                Console.log(lines.toString());
            }
        }
    }
}