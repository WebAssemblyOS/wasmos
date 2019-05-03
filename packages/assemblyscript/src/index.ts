export * from "./compiler/compiler";
import * as loader from "assemblyscript/lib/loader/lib";
export { loader };
export * from "assemblyscript/lib/host/lib";
export * from "./linker";

export async function main() {}
