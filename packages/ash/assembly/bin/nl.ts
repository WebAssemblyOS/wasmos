export function main(args: string[]): void {
    let option: string = "";
    let argnumber = 1;
    if (args[1] == "-b") {
        option = args[2]
        argnumber = 3;
    }
    let res = fs.openFile(args[argnumber])
    if (res.error) {
        //This is just the log for testing need to use Console.error
        Console.error("nl: " + args[argnumber] + ": No such file or directory");
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
        let intro = "";
        if (option == "" || option == "t") {
            //@ts-ignore  Integer does have to string method.
            intro = "    " + num.toString() + "  ";
        }
        else if (option == "n") {
            intro = "       "
        }
        Console.write(intro.concat(line.result));
        line = file.readLine();
        num++;
    }
}
