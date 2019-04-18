import { ASProcess, Args, Arg } from "../src/process/wasm";
import { stringToUTF8Array, fromUTF8Array } from "@wasmos/utils";
import { loader } from "@wasmos/assemblyscript/src";

var args: Args;
const Hello = "Hello";
const world = "world";
beforeEach(() => {
  args = new Args();
});

describe("Args", () => {
  it("has size and bytes", () => {
    args.push(Hello);
    let data = new Uint8Array(Hello.length * 4 + 1);
    let size = stringToUTF8Array(Hello, data, 0, Hello.length + 2);
    expect(args.bytes.slice(0, args.size - 1)).toEqual(data.slice(0, size));
    args.push(world);
    expect(args.length).toBe(2);
  });
});

describe("Process", () => {
  describe("Storing data", () => {
    it("should store args", async () => {
      args.push(Hello);
      args.push(world);
      let _args = [Hello, world];
      let asp = new ASProcess(_args);
      expect(asp.UT8Args.length).toBe(2);
      expect(fromUTF8Array(asp.UT8Args.args[0].data)).toEqual(Hello);
    });
  });
});
