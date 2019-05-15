import { Wasi } from "../../../assemblyscript/assembly/wasi";

function dirExists(dir: string): bool {
  // if not an actual or empty string - return false
  if (!dir || dir.length < 1) {
    return false;
  }
  // check if the directory exists
  let checkDirExists = fs.openDirectory(dir);
  if (!checkDirExists.failed) {
    return true;
  } else if (checkDirExists.failed && checkDirExists.error == Wasi.errno.NOENT) {
    // dir doesnt exist - create it
    let createDir = fs.createDirectory(dir);
    if (!createDir.failed) {
      return true;
    } else {
      Console.error("tempdir: Could not create tempdir at " + dir + ". Error: " + Wasi.errno.toString(createDir.error));
      return false;
    }
  }
  return false;
}

function writeableDir(dir: string): bool {
  log<string>("in writeableDir function");
  // directory exists - try making a file inside it
  if (dirExists(dir)) {
    log<string>("dir: " + dir + " exists");
    let dirFd = fs.openDirectory(dir).result.fd;
    let tempFileName = '/testfile';
    let tempFilePath = dir + tempFileName;
    let writeFileToDir = fs.createFileAt(dirFd, tempFilePath);
    if (!writeFileToDir.failed) {
      log<string>("dir: " + dir + " can be written to");
      return true;
    } else {
      log<string>("temp file: " + dir + " CANNOT be created due to error: " + Wasi.errno.toString(writeFileToDir.error));
      Console.error("tempdir: Could not write to tempdir at " + dir + ". Error: " + Wasi.errno.toString(writeFileToDir.error));
      return false;
    }
  }
  return false;
}

export function main(args: string[]): void {
  log<string>("in tempdir command");
  let tempdir = writeableDir('/tmp');
  if (tempdir) {
    Console.write('/tmp', false);
  }
}