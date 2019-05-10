/// <reference lib="dom" />

import { Kernel } from "../packages/kernel/src";
import { fs } from "../packages/fs/src";
import { bootup } from "./loader";

export async function main() {
  await bootup();
  (window as any).kernel = await Kernel.create();
  (<any>window).fs = fs;
}
main();
