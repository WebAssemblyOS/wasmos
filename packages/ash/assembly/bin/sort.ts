


export function main(args: string[]): void {


  if (args[1] == "-n") {
    let _args = args.slice(2).join(" ");
    Console.write(_args, false)
  } else {
    let _args = args.slice(1).join(" ")
    Console.log(_args);
  }


}
