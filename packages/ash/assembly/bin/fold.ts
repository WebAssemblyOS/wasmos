

export function main(args: string[]): void {
    if (args.length <= 1) {
        return;
    }
    let width = 80;
    let fileName = args[1];
    if (args.length == 4) {
        // assuming args = ['-w', a num, filename]
        width = parseInt(args[2]) as i32;
        fileName = args[3];
    }
    let file = fs.openFile(fileName);
    if (file.failed) {
        Console.error("fold: " + fileName + ": No such file or directory");
    }
    let data = file.result.readString().result;
    let lines = data.split('\n');
    let newLines: string[] = new Array();
    for (let i = 0; i < lines.length; i++) {
        let arr = lines[i].split('');
        while (arr.length > 0) {
            newLines.push(arr.splice(0, width).join(''));
        }
    }
    Console.log(newLines.join('\n'));
}
