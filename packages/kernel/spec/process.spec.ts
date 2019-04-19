import { UTF8, Env } from "../src/process";
import { ASProcess } from "../src/process/wasm";
import { stringToUTF8Array, fromUTF8Array, toUint8Array } from "@wasmos/utils";
import { loader } from "@wasmos/assemblyscript/src/index";

var args: UTF8.Array;
var env: UTF8.Map;
const Hello = "Hello";
const world = "world";
beforeEach(() => {
  args = new UTF8.Array([]);
  env = UTF8.Map.fromMap(new Map([[Hello, world]]));
});

function bytesEqual(expected: Uint8Array, received: Uint8Array) {
  expect(expected.subarray(0, expected.length - 1)).toEqual(received);
}

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

describe("Env", () => {
  it("has should add an equal sign", async () => {
    //One for `=` and null at the end.
    expect(env.size).toBe(Hello.length + world.length + 2);
    bytesEqual(env.bytes, toUint8Array([Hello, world].join("=")));
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
    });
  });
});
