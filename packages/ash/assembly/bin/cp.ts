export function main(args: string[]): void {
  if (args.length > 2) {
    let dir = fs.openDirectory(args[args.length - 1]);
    if (!dir.failed) {
      for (let i: i32 = 1; i < args.length - 1; i++) {
          let file = fs.openFile(args[i]);
          if (file.failed) {
              Console.error("cp: " + args[i] + ": No such file or directory");
              continue;
          }
          fs.createFileAt(dir.result.fd, args[i]);
      }
    } else {
      if (args.length > 3) {
        Console.error("usage: cp source_file target_file\ncp source_file ... target_directory");
      } else {
        let srcFile = fs.openFile(args[1]);
        if (srcFile.failed) {
            Console.error("cp: " + args[1] + ": No such file or directory");
        }
        let dstFile = fs.openFile(args[2]);
        if (!dstFile.failed) {
          // File exists, we need to overwrite its contents
          // One way is to erase/delete it, then recreate
          // Erase and delete currently don't work well for me
          //dstFile.result.erase();
        }
        fs.createFile(args[2]);
        dstFile = fs.openFile(args[2]);
        fs.writeString(dstFile.result.fd, fs.readString(srcFile.result.fd).result);
      }
    }
  } else {
    Console.error("usage: cp source_file target_file\ncp source_file ... target_directory");
  }
}
