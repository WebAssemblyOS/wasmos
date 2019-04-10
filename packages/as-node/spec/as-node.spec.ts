
import { exec } from "..";
import { fs } from "@wasmos/fs";

beforeAll(() => {
  process.chdir(__dirname + "/..");
})

describe("echo", () => {
  it("should compile", async () => {
    console.log(process.cwd())
    await exec("./assembly/bin/echo.ts", "hello world");
    console.log(await fs.readdir("."))

    expect(await fs.pathExists('./dist/bin/echo/index.wasm')).toBe(true)
  }, 20000);
});
