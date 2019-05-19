
//@ts-ignore
@global
export function main(args: string[]): void {
  let console = Console.init();
  let newLine: bool = true;
  let _args: string[] = new Array<string>();
  let start: i32 = 1
  if (args[1] == "-n") {
    start = 2;
    newLine = false
  }
  for (let i = start; i < args.length; i++) {
    if (args[i] == "$PATH") {
      let env = Environ.init();
      _args.push(env.get("$PATH"));
    } else {
      _args.push(args[i]);
    }
  }
  console.write(_args.join(" "), true);
}
