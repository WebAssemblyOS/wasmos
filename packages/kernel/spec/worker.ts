/* eslint-disable no-undef */

import * as BrowserFS from "browserfs";
// import { isMainThread, parentPort, workerData } from "worker_threads";
// import {promisfy} from "../src/util";
import * as fs from "fs";

function promisfy(fn: any): any {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, contents) => {
        if (err) reject(err);
        resolve(contents);
      });
    });
}

type Address = string;
console.log("hello");
//
// class Worker {
//   addEventListener = parentPort.on
//
//   postMessage( mesg: any ): void {
//     console.log(mesg)
//     parentPort.postMessage(mesg);
//   }
// }

async function start() {
  //   try {
  //     debugger;
  await promisfy(BrowserFS.configure)({
    fs: "WorkerFS",
    options: { worker: self }
  });
  let fs = BrowserFS.BFSRequire("fs");
  // onmessage = (mesg: any) => {
  //   postMessage({type:"String"},"");
  // };
  console.log(await promisfy(fs.readdir)("."));
  // fs.watch(".", (event, filename) => {
  //   console.log(event, filename);
  // })
  // postMessage("hi");
  //   } catch (err) {
  //     console.log(err);
  //   }
}
//
start();
// parentPort.postMessage(mesg));
