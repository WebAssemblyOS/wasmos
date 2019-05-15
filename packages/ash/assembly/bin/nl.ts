export function main(args: string[]): void {
    let res = fs.openFile(args[1]);
    if (res.error) {
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
        let intro: string = `    ${num} `;

        Console.write(intro.concat(line.result));
        line = file.readLine();
        num++;
    }
}
