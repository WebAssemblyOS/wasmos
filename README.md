## Wasm OS

This is a kernel for running AssemblyScript/WebAssembly applications.

It will provide:

1. Synchronous file system
1. Implements the node `process` module.
1. Shared Memory between kernel threads to allow for atomic `wait/notify` for syscalls.
1. Networking interface for P2P applications.

## Project Setup

This project is [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/), which allows this repo to host multiple project in one repo, making it a "mono-repo." The key idea is that each package in the repo must be a stand alone, but it makes it easy to have them depend on each other and you can use a scoping package name. For example, this project needs a wrapper around the assemblyscript compiler, which is conveniently called `@wasmos/assemblyscript.`


# First step

After cloning, 
```
npm install
npm run ci # this bootstraps all packages and runs tests.
```

This installs all of the top level dependencies, e.g. `typescript` and `jest`, and then installs each lerna package.  This includes creating symlinks for local dependencies.  And then runs tests.

Next head to [this tutorial](docs/tutorial.md)
