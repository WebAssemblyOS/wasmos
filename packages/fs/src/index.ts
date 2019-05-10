import * as BrowserFS from "browserfs/dist/browserfs";
import { glob, promisfy } from "./glob";

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
      function(e) {
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
import * as fs from "fs-extra";
export { fs };
export * from "./mkdirp";
export * from "./glob";
