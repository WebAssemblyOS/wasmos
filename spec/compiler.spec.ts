//
// import 'jsdom-worker';

// beforeAll(async () => {
//

//
// }, 10000);

afterAll(async () => {
  // worker.terminate();
});

describe("worker thread", () => {});
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
