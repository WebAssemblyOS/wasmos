#!/usr/bin/env ts-node
import { Compiler } from "../src";
if (process.argv.length < 3) {
  process.exit(0);
}
Compiler.compileOne(process.argv[2]);
