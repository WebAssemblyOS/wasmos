// import {_process, Process} from "../preamble";
import { log } from "../../node_modules/assemblyscript/lib/host/assembly";

export const enum ExitStatus {
  EXIT_FAILURE = -1,
  EXIT_SUCCESS = 0
}

function _main(argv: string[]): ExitStatus {
  log<string>(argv.slice(1).join(" "));
  return ExitStatus.EXIT_SUCCESS;
}

// log(process.uid)
// log(process);
// log(process.argv[0]);
process.exitCode = _main(process.argv);
