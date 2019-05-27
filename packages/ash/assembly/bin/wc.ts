export function main(args: string[]): void {
  let option: string = "";
  let argnumber = 1;
  if (args[1] == "-l") {
    option = args[1]
    argnumber = 2;
  }

  if (args.length != 3) {
    Console.error("wc -l: incorrect number of arguments");
    // log<string>(`head: file: incorrect number of arguments`);
    return;
  }
  let res = fs.openFile(args[argnumber])
  if (res.error) {
    //This is just the log for testing need to use Console.error
    Console.error("wc: " + args[argnumber] + ": open: No such file or directory");
    // log<string>(`head: file: No such file or directory`);
    return;
  }

  let file = res.result;
  let line = file.readLine();
  let numOfLines = 0;
  //@ts-ignore  Integer does have to string method.
  let resultString = "\\t" + numOfLines.toString() + " " + args[argnumber];
  Console.stdin.reset();

  // the conditional exists to make it explicit that the only 
  // functionality implemented right now is for wc -l

  if (option == "-l") {
    // covers the case of an empty file
    if (line.failed) {
      Console.write(resultString);
      return;
    }

    while (!line.failed) {
      numOfLines++;
      line = file.readLine();
    }
    Console.write(resultString);
  }
}
