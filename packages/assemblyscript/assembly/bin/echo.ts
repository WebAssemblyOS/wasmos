// import {_process, Process} from "../preamble";
import { log } from "../../lib/host/assembly";
import "allocator/arena";

export const enum ExitStatus {
  EXIT_FAILURE = -1,
  EXIT_SUCCESS = 0
}

export function _main(argv: string[]): ExitStatus {
  log<string>(argv.slice(1).join(" "));
  return ExitStatus.EXIT_SUCCESS;
}
