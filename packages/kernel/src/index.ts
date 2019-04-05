
// import { attachWorker } from "./fs";

export class Kernel {
  worker: Worker
  constructor(path: string = "worker.js") {
    this.worker = new Worker(path);
    // attachWorker(this.worker);
    this.worker.postMessage({ init: path });
    this.worker.onmessage = this.onmessage.bind(this)
  }

  onmessage(event: MessageEvent) {
    console.log(event.data);
  }

  static async create(path?: string): Promise<Kernel> {
    let kernel = new Kernel(path);

    return kernel;
  }
}
