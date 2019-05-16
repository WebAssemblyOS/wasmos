export function main(args: string[]): void {
    let res = fs.openFile(args[1]);
    if (res.error) {
        //This is just the log for testing need to use Console.error
        Console.error("nl: " + args[1] + ": No such file or directory");
        // log<string>(`head: file: No such file or directory`);
        return;
    }
    let file = res.result;
    let line = file.readLine();
    let num = 1;
    Console.stdin.reset();

    if (line.failed) {
        return;
    }
    while (!line.failed) {
        //@ts-ignore  Integer does have to string method.
        let intro: string = "    " + num.toString() + "  ";

        Console.write(intro.concat(line.result));
        line = file.readLine();
        num++;
    }
}
