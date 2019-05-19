//import { os } from "../../../../packages/os";
//
export function main(args: string[]): void {
  //let dir = args[1]; //or fs.getDir(file);
  let dir = fs.openDirectory(args[1]);

  if(!dir) {
  //  log<string>("helloworld");
    // if no dest dir go to home director
    dir = fs.openDirectory('/');
    if(dir.failed) {
       Console.error("unable to open home directory");
    }
   } else {
  //  log<string>("helloworld");
    Console.error("unable to open dir" + args[1]);
   }
}
