export function main(args: string[]): void {
  let newLine: bool = true;
  let _paths: string[] = new Array<string>();
  let start: i32 = 1

  for (let i = start; i < args.length; i++) {
    if (args[i].startsWith("-")) {
      if (args[i] == "-z" || args[i] == "--zero") {
        newLine = false;
      } else {
        if (args[i].lastIndexOf("-") == 0) {
          Console.error("dirname: invalid option -- '" + args[i].substr(1, 1) + "'");
        } else {
          Console.error("dirname: unrecognized option '" + args[i] + "'");
        }
        return;
      }
    } else {
      let lastSlashIndex: i32 = args[i].lastIndexOf("/");
      let path: string = lastSlashIndex == 0 ? "/" : lastSlashIndex < 0 ? "." : args[i].substring(0, lastSlashIndex);
      _paths.push(path);
    }
  }


  Console.write(_paths.join(newLine ? "\n" : " "), newLine);
}