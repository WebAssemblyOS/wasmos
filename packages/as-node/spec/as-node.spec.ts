
import { exec } from "..";
import { fs } from "@wasmos/fs/src";

beforeAll(() => {
  process.chdir(__dirname + "/..");
})

describe("echo", () => {
  it("should compile", async () => {
    await exec("./assembly/bin/echo.ts", "hello world");
    expect(await fs.pathExists('./dist/bin/echo/index.wasm')).toBe(true)
  }, 20000);
});
