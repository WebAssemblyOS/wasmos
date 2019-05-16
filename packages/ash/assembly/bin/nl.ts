export function main(args: string[]): void {
    let res = fs.openFile(args[1]);
    if (res.error) {
        //This is just the log for testing need to use Console.error
        log<string>(`head: file: No such file or directory`);
        return;
    }
    let file = res.result;
    let line = file.readLine();
    var num = 1;

    if (line.failed) {
        return;
    }
    while (!line.failed) {
        log<string>(line.result + "-")
        //@ts-ignore  Integer does have to string method.
        let intro: string = "    " + num.toString() + "  ";

        Console.write(intro.concat(line.result));
        line = file.readLine();
        num++;
    }
}
