export function main(args: string[]): void {
    let flags = "";
    let file = fs.openFile(args[1]).result;
    let line = file.readLine();
    let currLine: string | null = null;

    while (!line.failed) {
        if (currLine == null) {
            currLine = line.result
        } else if (currLine != line.result) {
            Console.log(currLine);
            currLine = line.result;
        }

        line = file.readLine();
    }
    Console.log(currLine!);
}