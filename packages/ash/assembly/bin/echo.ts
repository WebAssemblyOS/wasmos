export const enum ExitStatus {
  EXIT_FAILURE = -1,
  EXIT_SUCCESS = 0
}

function _main(argv: string[]): ExitStatus {
  Console.log(argv.slice(1).join(" "));
  return ExitStatus.EXIT_SUCCESS;
}

// log(process.uid)
// log(process);
// log(process.argv[0]);
