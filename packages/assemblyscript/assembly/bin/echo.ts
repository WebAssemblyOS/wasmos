// import { IO, Console } from "@wasmos/wasa";

// import {_process, Process} from "../preamble";
// import { Console } from "@wasmos/wasa";
// import "allocator/arena";

// import { Console } from "../wasa/mock";

export const enum ExitStatus {
  EXIT_FAILURE = -1,
  EXIT_SUCCESS = 0
}

export function _main(argv: string[]): ExitStatus {
  // Console.log(argv.slice(1).join(" "));
  return ExitStatus.EXIT_SUCCESS;
}
