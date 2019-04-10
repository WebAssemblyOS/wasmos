import { loader, ASImport, Host, Env } from "@wasmos/assemblyscript";

import { fs } from "@wasmos/fs";
import * as path from "path";

enum ExitStatus {
  Finished = 0,
  Crashed = -1
}

class EnvVariale extends Env {
  path: path.ParsedPath[] = ["/bin"].map(path.parse);

  add(_path: string): EnvVariale {
    this.path.push(path.parse(_path));
    return this;
  }
}

let NUM_PAGES = 10;
export class Process {
  stdout = Array<string>();
  status: ExitStatus;
  host: Host;
  binName: string;
  binpath: string;

  constructor(public args: string, public env: EnvVariale = new EnvVariale()) {
    this.binName = args.substring(0, args.indexOf(" "));
  }

  async searchPath(name: string): Promise<string> {
    for (let _path of this.env.path) {
      let binary = path.join(_path.dir, _path.base, name, "index.wasm");
      let asc = path.join(_path.dir, _path.base, name, "index.ts");
      if ((await fs.pathExists(binary)) || (await fs.pathExists(asc))) {
        return binary;
      }
    }
    return null;
  }
}

export class ASProcess extends Process {
  instance: loader.ASInstance;
  module: WebAssembly.Module = null;
  stdout = Array<string>();
  status: ExitStatus;
  host: Host;
  binName: string;
  binpath: string;

  constructor(public args: string, env?: EnvVariale) {
    super(args, env);
  }

  readStdout(s: string | number): void {
    this.stdout.push(typeof s === "string" ? s : this.readString(s));
  }

  readString(x: number): string {
    return loader.utils.readString(
      this.instance.memory.U32,
      this.instance.memory.U16,
      x
    );
  }

  start(): Process {
    var res;
    try {
      let imports = ASImport.createImport(this.env, Host);
      this.instance = loader.instantiate(this.module, imports);
      let args = this.args.split(new RegExp("\\s+")).join(" ");
      let s = this.instance.memory.newString(args);
      res = (<any>this.instance)._main(s);
    } catch (Error) {
      res = ExitStatus.Crashed;
    }
    this.status = res < 0 ? ExitStatus.Crashed : ExitStatus.Finished;
    return this;
  }

  static exec(args: string): Process {
    let process = new ASProcess(args);
    return process.start();
  }
}
