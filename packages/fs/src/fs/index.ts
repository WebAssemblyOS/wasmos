import * as BrowserFS from "browserfs/dist/browserfs";
import { glob, promisfy } from "../glob";

export async function assemblyFolders(startingDir: string): Promise<string[]> {
  let dir = startingDir + "/node_modules/**/**/assembly";
  let res = new Set();
  return (await glob(dir))
    .filter(
      v => !(v.endsWith("std/types/assembly") || v.endsWith("std/assembly"))
    )
    .reduce((acc: string[], v: string) => {
      let endName = v.substring(v.lastIndexOf("node_modules"));
      if (!res.has(endName)) {
        acc.push(v);
        res.add(endName);
      }
      return acc;
    }, []);
}
export async function init(
  root: string | ArrayBuffer = "assembly.zip"
): Promise<void> {
  BrowserFS.install(global || window);
  return new Promise(async (resolve, reject) => {
    let zipData;
    if (typeof root === "string") {
      let response = await fetch(root);
      zipData = await response.arrayBuffer();
    } else {
      zipData = root;
    }
    BrowserFS.configure(
      {
        fs: "MountableFileSystem",
        options: {
          "/": {
            fs: "OverlayFS",
            options: {
              readable: {
                fs: "ZipFS",
                options: {
                  // Wrap as Buffer object.
                  zipData: Buffer.from(zipData)
                }
              },
              writable: {
                fs: "LocalStorage",
                options: {}
              }
            }
          }
        }
      },
      function (e) {
        if (e) {
          // An error occurred.
          reject(e);
        }
        resolve();
      }
    );
  });
}

export async function initWorker(): Promise<void> {
  await promisfy(BrowserFS.configure)({
    fs: "WorkerFS",
    options: { worker: self }
  });
}
export function attachWorker(worker: Worker) {
  BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
}

import { promises as _fs, constants } from "fs";


interface fs {
  pathExists(path: string): Promise<boolean>;
  mkdirp(
    p: string,
    opts?: any,
    made?: string
  ): Promise<string | null>
}
let fs: fs & typeof _fs = { ..._fs, pathExists, mkdirp };

async function pathExists(path: string): Promise<boolean> {
  try {
    await _fs.access(path, constants.R_OK | constants.W_OK)
    return true;
  } catch (error) {
    return false
  }
}
/*
Copyright 2010 James Halliday (mail@substack.net)

This project is free software released under the MIT/X11 license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import * as path from "path";

var _0777 = parseInt("0777", 8);
/**
 * Creates a directory including the parents if they don't exist.
 */
export async function mkdirp(
  p: string,
  opts: any | null = null,
  made: string | null = null
): Promise<string | null> {
  if (!opts || typeof opts !== "object") {
    opts = { mode: opts };
  }
  var mode = opts.mode;
  if (mode === undefined) {
    mode = _0777 & ~process.umask();
  }
  if (!made) made = null;
  p = path.resolve(p);
  try {
    await _fs.mkdir(p, mode);
    made = made || p;
  } catch (err0) {
    switch (err0.code) {
      case "ENOENT":
        made = await mkdirp(path.dirname(p), opts, made);
        await mkdirp(p, opts, made);
        break;
      default:
        var stat;
        try {
          stat = await _fs.stat(p);
        } catch (err1) {
          throw err0;
        }
        if (!stat.isDirectory()) throw err0;
        break;
    }
  }
  return made;
}

export { fs };

