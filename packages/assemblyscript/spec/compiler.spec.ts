//
import * as fs from "fs";
import * as path from "path";
// beforeAll(async () => {
//

//
// }, 10000);
import { Compiler } from "../src";

// afterAll(async () => {
//   // worker.terminate();
// });

describe("echo", () => {
  it("should compile", async () => {
    await Compiler.compileOne(
      path.join(__dirname, "..", "assembly", "bin", "echo.ts")
    );
  }, 20000);
});
