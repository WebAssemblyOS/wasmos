/// <reference lib="dom" />

import { Kernel } from "../packages/kernel";
import { fs } from "../packages/kernel/packages/fs";
import { bootup } from "./loader";

export async function main() {
  await bootup();
  (window as any).kernel = await Kernel.create();
  (<any>window).fs = fs;
}
main();
