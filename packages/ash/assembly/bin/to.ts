import { WasiResult } from "../../../assemblyscript/assembly/wasa";
import { Wasi } from '../../../assemblyscript/assembly/wasi';


function validFile(fileName: string): bool {
  log<string>("in validFile function");
  let openFile: WasiResult<FileDescriptor> = fs.openFile(fileName);
  log<Wasi.errno>(openFile.error);
  if (!openFile.failed) {
    log<string>("in validFile function - can open file");
    fs.close(openFile.result.fd);
    return true;
  }
  log<string>("in validFile function - cannot open file");
  return false;
}

function writeToFile(txt: string, fileName: string): bool {
  log<string>("in writeToFile function");
  let openFile: WasiResult<FileDescriptor> = fs.openFile(fileName);
  if (openFile.failed) {
    log<string>("in validFile function - cannot open file for write");
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
  log<string>("in validToCommand function");
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
  log<string>("in to command");
  if (validToCmd(args)) {
    log<string>("valid command");
    let txt: string = args[1];
    let fileName: string = args[2];
    if (validFile(fileName)) {
      log<string>("valid file");
      if (writeToFile(txt, fileName)) {
        log<string>("wrote to file");
        Console.log(txt);
      } else {
        Console.error("Could not write to file: " + fileName);
      }
    } else {
      Console.error("No such file: " + fileName);
    }
  } else {
    Console.error("Wrong arguments. Usage: to <text> <file name>");
  }
}
