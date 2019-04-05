
import * as fs from "./fs";
import {Process} from "./process";
import {ViewBuffer, CharBuffer} from "./screen";

@external("kernel", "initProcess")
declare function initProcess(p: Process): void;

class Queue<T> extends Array<T>{

}

/**
 * This is singleton class is the core of the OS.
 * It's purpose is to be the link between WebAssembly programs and the browser.
 *
 */
class Kernel {
  /**
   * The state of the kernel is:
   * - filesystems mounted
   * - open files
   * - running processes
   * - waiting processes
   * - idle processes
   */
   public fs:      FileSystem;
   public running: Queue<Process>;
   public waiting: Queue<Process>;
   public idle:    Queue<Process>;

   /** Process initial running that can forked and execed.
    *  For our purpose it will be the shell.
    */
   private init: Process;

   constructor() {
     this.fs      = new FileSystem();
     this.running = new Queue<Process>();
     this.waiting = new Queue<Process>();
     this.idle    = new Queue<Process>();
     this.init    = new Process("/boot/init", process.cwd);
   }




}
