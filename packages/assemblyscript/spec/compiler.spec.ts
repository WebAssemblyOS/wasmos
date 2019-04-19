/// <reference types="jest" />
import * as shell from "shelljs";
import * as path from "path";

import { Compiler, linkLibrary } from "../src";

const ROOT = path.join(__dirname, "..");

describe("Link Library", () => {
  (<any>test)(
    "should find all the assembly files",
    async () => {
      await linkLibrary(ROOT);
      expect(shell.test("-e", ROOT + "/node_modules/.assembly")).toBe(true);
    },
    4000
  );
});

describe("echo", () => {
  it("should compile", async () => {
    let x = 1;
    let y = x + x;
    // process.chdir(__dirname + "/..");
    // await Compiler.compileOne(path.join("./assembly", "bin", "echo.ts"));
  }, 20000);
});
