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
import { Process, InputStream, OutputStream, process } from "./process";

/**
 * The entry function to start the Instance after it's been initialized.
 */
@start()
export function main(): void {}

declare function setUpProcess(): void;

setUpProcess();

export { Process, InputStream, OutputStream };

export function _process(): Process {
  return process;
}

export function createProcess(command: string, currentDir: string): void {
  Process.create(command, currentDir);
}
