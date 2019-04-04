import * as loader from "assemblyscript/lib/loader";
import * as fs from "fs";
import { Host, ASImport, Env } from "assemblyscript/lib/host/lib";
import { Compiler } from "@wasmos/assemblyscript";
import * as path from "path";
import { promisfy } from "@wasmos/utils";

interface Binary extends loader.ASInstance {
  main(): void;
  createProcess(argv: number, cwd: number): void;
}

async function loadBinary<T extends Binary>(
  binPath: string,
  imports: any
): Promise<T & loader.ASInstance> {
  let bin = await promisfy(fs.readFile)(binPath);
  let instance = loader.instantiateBuffer<T>(bin, imports);
  return instance;
}

export async function exec(filename: string, _cwd?: string) {
  let cwd: string = _cwd ? _cwd : process.cwd();
  let opts = Compiler.opts;
  let wasmPath = path.join(__dirname, opts.outDir, filename, "index.wasm");
  try {
    await promisfy(fs.stat)(wasmPath);
  } catch (error) {
    await Compiler.compileOne(filename + ".ts");
  }

  let instance: Binary;
  function str(s: string): number {
    return instance.memory.newString(s);
  }
  let preamble = {
    setUpProcess: () => {
      instance.createProcess(str(process.argv.slice(2).join(" ")), str(cwd));
    }
  };
  let stdout: string[] = [];
  Host.stdout = x => {
    stdout.push(
      (x => {
        if (typeof x !== "string") {
          return instance.memory.getString(x);
        } else {
          return x;
        }
      })(x)
    );
  };
  let imports = ASImport.createImport(Host, Env);
  instance = await loadBinary(wasmPath, { ...imports, preamble });
  instance.main();
  console.log(stdout.join("\n"));
}
