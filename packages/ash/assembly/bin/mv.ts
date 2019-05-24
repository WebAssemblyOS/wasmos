import * as path from "../../../assemblyscript/assembly/wasa/mock/path"

export function main(args: string[]): void {
    if (args.length > 2) {
        let dir = fs.openDirectory(args[args.length - 1]);
        if (!dir.failed) {
            log<string>(dir.result.file!.path)
            for (let i: i32 = 1; i < args.length - 1; i++) {
                let file = fs.openFile(args[i]);
                if (file.failed) {
                    Console.error("mv: " + args[i] + ": No such file or directory");
                    continue;
                }
                let dest = fs.createFileAt(dir.result.fd, path.basename(args[i])).result;
                dest.writeString(file.result.readString().result);

            }
        } else {
            if (args.length > 3) {
                Console.error("usage: mv source_file target_file\nmv source_file ... target_directory");
            } else {
                let res = fs.openFile(args[1]);
                if (res.failed) {
                    Console.error("mv: " + args[1] + ": No such file or directory");
                }
                let srcFile = res.result;
                let dstFile = fs.createFile(args[2]); //You can use create here as it will not care if does exist
                if (dstFile.failed) {
                    Console.error("Failed to create " + args[2]);
                    return;
                    // File exists, erase it so that we can recreate it
                }
                dstFile.result.erase();
                let srcString = srcFile.readString().result;
                log<string>(srcString)
                dstFile.result.writeString(srcString);
                fs.close(srcFile.fd);
                let res2 = fs.delete(args[1]);
                if(res2.failed) {
                    Console.error("mv: " + args[1] + ": Is a directory and not a file, need to further implement");
                    // Try this?
                    //fs.deleteDirectory(args[1]);
                }
            }
        }
    } else {
        Console.error("usage: mv source_file target_file\nmv source_file ... target_directory");
    }
}
