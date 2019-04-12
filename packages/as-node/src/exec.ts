import { ASProcess } from "@wasmos/kernel";
import { Compiler } from "@wasmos/assemblyscript/src";

import { fs } from "@wasmos/fs";
import * as path from "path";

export async function exec(filename: string, args?: string) {
  let opts = Compiler.opts;
  let name = path.basename(filename);
  let wasmPath = path.join(opts.outDir, name, "index.wasm");

  if (!(await fs.pathExists(wasmPath))) {
    await Compiler.compileOne(path.resolve(filename), { lib: false });
  }
  // let _process = ASProcess.exec([filename, args].join(" "));
  // console.log(_process.stdout.join("\n"));
}
