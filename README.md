## Wasm OS

This is a kernel for running AssemblyScript/WebAssembly applications.

It provides the following.

1. Synchronous file system
1. Implements the node `process` module.
1. Shared Memory between kernel threads to allow for atomic `wait/notify` for syscalls.
1. Networking interface for P2P applications.

## Project Setup

This project is [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/), which allows this repo to host multiple project in one repo, making it a "mono-repo." The key idea is that each package in the repo must be a stand alone, but it makes it easy to have them depend on each other and you can use a scoping package name. For example, this project needs a wrapper around the assemblyscript compiler, which is conviently called `@wasmos/assemblyscript.`

This project also uses a git submodule for `wasa`, a fork of [jedisct1/wasa](https://github.com/jedisct1/wasa), which is a library for interacting with the new [wasi](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/), WebAssembly Interface, a core API imported by the runtime.

# First step

After cloning, install packages with `npm run bootstrap` instead of the uses `npm run install`
