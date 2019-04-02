/// <reference lib="dom" />

import {Kernel} from './kernel';
import {fs} from "./fs";
import {bootup} from "./loader";

export async function main() {
  await bootup();
  (window as any).kernel = await Kernel.create();
  (<any>window).fs = fs;
}
main()
