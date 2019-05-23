import { Wasi } from "../../../assemblyscript/assembly/wasi";

function validFile(fileName: string): bool {
  let openFile = fs.openFile(fileName);
  if (!openFile.failed) {
    fs.close(openFile.result.fd);
    return true;
  } else if (openFile.failed && openFile.error == Wasi.errno.NOENT) {
    // file doesnt exist - so create it    
    let createFile = fs.createFile(fileName);
    if (!createFile.failed) {
      fs.close(createFile.result.fd);
      return true;
    } else {
      Console.error("to: Could not create new file: " + fileName);
      return false;
    }
  }
  return false;
}

function writeToFile(txt: string, fileName: string): bool {
  let openFile = fs.openFile(fileName);
  if (openFile.failed) {
    Console.error("to: Could not write to file: " + fileName);
    return false;
  } else {
    let writeToFile = fs.writeString(openFile.result.fd, txt);
    if (writeToFile == Wasi.errno.SUCCESS) {
      fs.close(openFile.result.fd);
      return true;
    }
  }
  return false;
}

function validToCmd(args: string[]): bool {
  if (args.length > 2) {
    if (args[1].length > 1) {
      if (args[2].length > 1) {
        return true;
      }
    }
  }
  return false;
}

export function main(args: string[]): void {
  if (validToCmd(args)) {
    let txt: string = args[1];
    let fileName: string = args[2];
    if (validFile(fileName)) {
      if (writeToFile(txt, fileName)) {
        Console.write(txt);
      }
    }
  } else {
    Console.error("to: Usage: to <text> <file name>");
  }
}
