export function main(args: string[]): void {
  if (args.length > 2) {
    for (let i: i32 = 1; i < args.length; i++) {
        let file = fs.openFile(args[i]);
        if (file.failed) {
            Console.error("cp: " + args[i] + ": No such file or directory");
            continue;
        }
    }
  } else {
    Console.error("usage: cp source_file target_file\ncp source_file ... target_directory");
  }
}
