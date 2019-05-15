


export function main(args: string[]): void {
  let newLine: bool = true;
  let _args: string[] = new Array<string>();
  let start: i32 = 1
  if (args[1] == "-n") {
    start = 2;
    newLine = false
  }
  for (let i = start; i < args.length; i++) {
    if (args[i] == "$PATH") {
      _args.push(Environ.get("$PATH"));
    } else {
      _args.push(args[i]);
    }
  }
  Console.write(_args.join(" "), newLine);
}
