type EnvVar = Map<string, string>;
export class InputStream {
  constructor() {}
}
export class OutputStream {
  constructor() {}
}

export class Process {
  private _uid: i32;
  private _cwd: string;
  public argv: string[];
  public cmd: string;
  public argv0: string;
  public stdout: OutputStream;
  public stdin: InputStream;
  public exitCode: i32;

  constructor(cmdline: string, currentDir: string) {
    this.cmd = cmdline;
    this.argv = cmdline.split(" ");
    this.argv0 = this.argv[0];
    this._cwd = currentDir;
    this.stdin = new InputStream();
    this.stdout = new OutputStream();
  }

  chdir(dir: string): void {
    this._cwd = dir;
  }

  get cwd(): string {
    return this._cwd;
  }

  get uid(): i32 {
    return this._uid;
  }
  static create(command: string, currentDir: string): void {
    process = new Process(command, currentDir);
  }
}
export var process: Process;
