
import { Console, fs, Process, CommandLine, fd, FileDescriptor } from '../wasa/mock/index';
import { Wasi } from "../wasi";

/** This file is included with tests so that the default globals are set up properly. */
beforeAll(() => {
    fs.fs.init();
})
