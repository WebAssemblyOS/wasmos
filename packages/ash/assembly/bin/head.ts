

export function main(args: string[]): void {
  let res = fs.openFile(args[1]);
  if (res.failed) {
    //print `head: file: No such file or directory
    return;
  }
  let file = res.result;
  for (let i = 0; i < 10; i++) {
    let line = file.readLine();
    if (line.failed) {
      break;
    }
    Console.write(line.result);
  }
}
