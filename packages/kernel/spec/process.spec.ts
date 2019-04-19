import { UTF8 } from "../src/process/utf8";
import { ASProcess} from "../src/process/wasm";
import { stringToUTF8Array, fromUTF8Array } from "@wasmos/utils";
import { loader } from "@wasmos/assemblyscript/src/index";

var args: UTF8Array;
const Hello = "Hello";
const world = "world";
beforeEach(() => {
  args = new UTF8Array([]);
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
      expect(asp.args.length).toBe(2);
      expect(fromUTF8Array(asp.utf8Args.args[0].data)).toEqual(Hello);
      asp.
    });
  });
});
