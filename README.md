## Wasm OS


This is a kernel for running AssemblyScript/WebAssembly applications.

It provides the following.

0. Synchronous file system
0. Implements the node `process` module.
0. Shared Memory between kernel threads to allow for atomic `wait/notify` for syscalls.
0. Networking interface for P2P applications.
