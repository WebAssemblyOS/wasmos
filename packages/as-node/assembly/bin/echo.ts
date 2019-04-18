// import {_process, Process} from "../preamble";
// import { process } from "../process";

import { File } from "@wasmos/fs";
import { Console, CommandLine } from "@wasmos/wasa/wasa";

export const enum ExitStatus {
  EXIT_FAILURE = -1,
  EXIT_SUCCESS = 0
}

function _main(argv: String[]): ExitStatus {
  Console.log(argv.slice(1).join(" "));

  return ExitStatus.EXIT_SUCCESS;
}

let commandLine = new CommandLine();
_main(commandLine.all());

let f = new File();
// log(process.uid)
// log(process);
// log(process.argv[0]);
// process.exitCode = _main(process.argv);
