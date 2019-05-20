import { dirname } from "../../../assemblyscript/assembly/wasa/mock/path";

export function name_dir (path: string): void{
  let stack = new Array <string>()
  stack.push(path)
  let parent = dirname(path)
  while (true) {
    let result = fs.openDirectory(parent);
    if (result.failed) {
      stack.push(parent)
      parent = dirname(parent)
    } else {
      break
    }
  }
  while (stack.length > 0) {
    let result = fs.createDirectory(stack.pop())
  }
}

// import {dirname} from
export function main(args: string[]): void {
  let p = false;

  if (args.length > 1) {
    let folder = args[1];

    if (args[1] == "-p") {
      if (args.length >= 2) {
        folder = args[2];
        p = true;
      } else {
        Console.error("Failed.")
        return
      }
    }
    let result = fs.createDirectory(folder)
    if (result.failed) {
      if (p) {
        name_dir(folder)
        return
      } else {
        Console.error("Failed.")
      }
    }
  }
}
