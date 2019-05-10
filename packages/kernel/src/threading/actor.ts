import * as assert from 'assert';

const ctx: Worker = self as any;

type method = (...a: any[]) => any;

/**
 * An actor is a remote object.
 */
export abstract class Actor {
  /**
   * Since constructors can't be asynchrous
   */
  abstract async init(...args: any[]): Promise<Actor>;

  methods: Map<string, method> = new Map<string, method>();

  /**
   * An actor has a unique address that other actors can use to send it messages.
   */
  constructor(public address: string | Uint8Array) { }

  onmessage(message: { fn: string, args: any[] }) {
    // postMessage({ result: this[message.fn](...message.args) });
  }


  bindWorker(worker: Worker) {
      let constructor = (<any>this).constructor;
      let className: string = constructor.name.toLowerCase();
      for (let member of Object.getOwnPropertyNames(constructor.prototype)) {
        if (typeof (<any>this)[member] == "function") {
          this[member] = (...args) => {
            // postMessage({ fn: member, args: args })
          }
        }
    }
  }



}
