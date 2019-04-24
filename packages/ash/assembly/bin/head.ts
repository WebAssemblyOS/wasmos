import {StringUtils} from "../../../assemblyscript/assembly/wasa/mock"
//creates string from array


export function main(args: string[]): void {
  let fd = fs.open(args[1]);

  let arr: Array<u8> = new Array<u8>(512);
  fs.read(fd, arr);

  let str = StringUtils.fromCString(changetype<usize>(arr.buffer_));
  let lines = str.split('\n');

  for (let i = 0; i < 10; i++) {
    Console.log(lines[i]);
  }
}
