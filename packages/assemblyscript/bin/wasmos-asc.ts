#!/usr/bin/env ts-node
import { Compiler } from "../src";
if (process.argv.length < 3) {
  console.log("missing input file")
  process.exit(0);
}
Compiler.compileOne(process.argv[2]);
