import * as fs from "fs";
import * as asc from "assemblyscript/cli/asc";
import * as path from "path";
import { promisfy } from "@wasmos/utils";

interface CompilerOptions {
  /** Standard output stream to use. */
  stdout?: asc.OutputStream;
  /** Standard error stream to use. */
  stderr?: asc.OutputStream;
  /** Reads a file from disk (or memory). */
  readFile?: (filename: string, baseDir: string) => Promise<string | null>;
  /** Writes a file to disk (or memory). */
  writeFile?: (
    filename: string,
    contents: Uint8Array,
    baseDir: string
  ) => Promise<void>;
  /** Lists all files within a directory. */
  listFiles?: (dirname: string, baseDir: string) => Promise<string[] | null>;
  /** Output Directory */
  outDir: string;
  /** Base directory for assembly source */
  baseDir: string;
}

export class Compiler {
  static get opts(): CompilerOptions {
    return Compiler._opts;
  }
  private static _opts = {
    readFile: async (basename: string, baseDir: string) => {
      let base = baseDir ? baseDir : "";
      let file = path.join(base, basename);
      try {
        let source = await promisfy(fs.readFile)(file);
        return source.toString();
      } catch (e) {
        return null;
      }
    },
    writeFile: async (
      basename: string,
      content: Uint8Array,
      baseDir: string
    ) => {
      let base = baseDir ? baseDir : "";
      let file = path.join(base, basename);
      await promisfy(fs.writeFile)(file, content);
    },
    // stdout: {write: console.log},
    // stderr: {write: console.error},
    listFiles: (basename: string, baseDir: string): Promise<string[]> => {
      let base = baseDir ? baseDir : "";
      let file = path.join(base, basename);
      return promisfy<string[]>(fs.readdir)(file);
    },
    stdout: asc.createMemoryStream(),
    stderr: asc.createMemoryStream(),
    outDir: "../dist/bin",
    baseDir: "./assembly"
  };

  static async compileOne(bin: string, _opts?: any): Promise<void> {
    let opts = { ..._opts, ...this.opts };
    let folder = bin.split(".")[0];

    let mesg = `
      -----------------------------------------------
      compiling ${bin}
      -----------------------------------------------
      `;
    opts.stdout.write(mesg);
    (<any>asc).main(
      [
        "preamble.ts",
        "bin/" + bin,
        "--baseDir",
        opts.baseDir,
        "--binaryFile",
        `${opts.outDir}/${folder}/index.wasm`,
        "--textFile",
        `${opts.outDir}/${folder}/index.wat`,
        "--tsdFile",
        `${opts.outDir}/${folder}/index.d.ts`,
        "--importMemory",
        "--measure",
        "--validate",
        "--debug",
        "--lib",
        "assembly/arg-as"
        // "--lib", path.join(__dirname, "..", "node_modules",
        //                   "assemblyscript", "lib", "host", "assembly")
        // "--sourceMap"
      ],
      { ...opts },
      (x: Error) => {
        if (x == null) {
          console.log(opts.stdout.toString());
          let err = opts.stderr.toString();
          if (err) {
            console.error(err);
          }
        } else {
          // debugger;
          console.log(opts.stdout.toString());
          console.error(opts.stderr.toString());
          console.error(x);
        }
      }
    );
  }
}
