import * as BrowserFS from "browserfs";
import { promisfy } from "./util";



export async function init(root: string | ArrayBuffer = "assembly.zip"): Promise<void> {
  BrowserFS.install(global || window)
  return new Promise(async (resolve, reject) => {
    let zipData;
    if (typeof root === "string") {
      let response = await fetch(root);
      zipData = await response.arrayBuffer();
    } else {
      zipData = root;
    }
    BrowserFS.configure({
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
        },
      }
    }, function(e) {
      if (e) {
        // An error occurred.
        reject(e)
      }
      resolve();
    });
  });
}

export function attachWorker(worker: Worker) {
  BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
}
import * as fs from "fs-extra";
export { fs }

export async function initWorker(): Promise<void> {
  await promisfy(BrowserFS.configure)({ fs: "WorkerFS", options: { worker: self } });
}

// import * as _fs from "fs";
// export * from "fs-extra";
