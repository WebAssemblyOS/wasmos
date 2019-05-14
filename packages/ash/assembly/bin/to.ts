import { getPath } from "../../../assemblyscript/assembly/wasa/mock/path";


function validFile(fileName: string): bool {
  let filePath: string = getPath(fileName);
  let openFile: WasiResult<FileDescriptor> = fs.openForWrite(filePath);
  if (!openFile.failed) {
    fs.close(openFile.result.fd);
    return true;
  }
  return false;
}

function writeToFile(txt: string, fileName: string): bool {
  let filePath: string = getPath(fileName);
  let openFile: WasiResult<FileDescriptor> = fs.openForWrite(filePath);
  if (openFile.failed) {
    return false;
  } else {
    let openFileFd: number = openFile.result.fd;
    let writeToFile: Wasi.errno = fs.writeString(openFileFd, txt);
    if (writeToFile == Wasi.errno.SUCCESS) {
      fs.close(openFileFd);
      return true;
    }
  }
  return false;
}

export function main(txt: string, fileName: string): void {
  if (!fileName || fileName.length < 1) {
    Console.error("Wrong arguments. Usage: to <string> <file name>");
  } else {
    if (validFile(fileName)) {
      if (writeToFile(txt, fileName)) {
        Console.write(txt);
      } else {
        Console.error("Could not write to file: " + fileName);
      }
    } else {
      Console.error("No such file: " + fileName);
    }
  }
}
