/**
 * This is concatenated to the assemblyscript to execute.
 */
/**
 * Must choose which memory allocator we want
 */
import "allocator/arena";

/**
 * Always needto export memory
 */
export { memory };
import { Process, InputStream, OutputStream } from "kernel/process";
import { log } from "../node_modules/assemblyscript/lib/host/assembly";

/**
 * The entry function to start the Instance after it's been initialized.
 */
export function main(): void {}

declare function setUpProcess(): void;

var process: Process;

setUpProcess();

export { Process, InputStream, OutputStream };

export function _process(): Process {
  return process;
}

export function createProcess(command: string, currentDir: string): void {
  process = new Process(command, currentDir);
}
