
import {RegExp} from "../regexp";
import {Argas} from "arg-as"
enum ExitStatus { EXIT_FAILURE, EXIT_SUCCESS }

declare function execv(path: string[]): ExitStatus

declare function log<T>(item: T): void;



export function _main(args: string): i32 {
  let argv: string[] = args.split(" ");
  let pattern = new RegExp(argv[1]);
  let rest: string = argv.slice(2).join(" ")
  if (pattern.test(rest))
    return 1;
  return -1;
}
