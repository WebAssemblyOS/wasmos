//
// import 'jsdom-worker';

import * as fs_ from "fs";
import {init, attachWorker} from '../src/fs';
import * as path from 'path';
const sleep = t => new Promise(r => { setTimeout(r, t); });

// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

let worker: Worker;


// beforeAll(async () => {
//

//
// }, 10000);

afterAll(async () => {
  // worker.terminate();
})

describe("worker thread", () => {
  it("should ping back", async () => {
    let res = await  (new Promise(async (resolve, reject) => {

      try {
        let zipData = fs_.readFileSync(path.join(__dirname, "build.zip"));
        console.log(zipData.length)
        await init(zipData);
        let source =  fs_.readFileSync(path.join(__dirname, "build","worker.js")).toString();
        let url = URL.createObjectURL(new Blob([source]))
        console.log(url)
        worker = new Worker(url);
        attachWorker(worker as any);
        worker.onmessage = (ev: MessageEvent) => {
          if (!ev.data.browserfsMessage){
            resolve(ev.data);
          }
        }
        worker.postMessage("Hi earth");
      } catch(error){
        console.log(error.stack); console.log(error.message);
      }
    }));
    console.log(res)
  }, 4000)
})
// describe('jsdom-worker', () => {
//   it('should work', async () => {
//     let code = `onmessage = e => { postMessage(e.data*2) }`;
//     let worker = new Worker(URL.createObjectURL(new Blob([code])));
//     worker.onmessage = jest.fn();
//     worker.postMessage(5);
//     await sleep(10);
//     expect(worker.onmessage).toHaveBeenCalledWith({ data: 10 });
//   });
//
//   it('should work with importScripts', async () => {
//     // const mod = await fs.readFile(path.join(__dirname, './module.js'));
//     const code = await fs.readFile(path.join(__dirname, './worker.js'));
//     // let combined = new Buffer(code.toString());
//     const worker = new Worker(URL.createObjectURL(new Blob([code])));
//     worker.onmessage = jest.fn();
//     worker.postMessage({});
//     await sleep(10);
//     expect(worker.onmessage).toHaveBeenCalledWith({ data: 'test' });
//   });
//
//   it('should work with IIFE', async () => {
//     const n = Math.random();
//     const code = `(function(n){ onmessage = e => { postMessage(n) } })(${n})`;
//     const worker = new Worker(URL.createObjectURL(new Blob([code])));
//     worker.onmessage = jest.fn();
//     worker.postMessage({});
//     await sleep(10);
//     expect(worker.onmessage).toHaveBeenCalledWith({ data: n });
//   });
// });
