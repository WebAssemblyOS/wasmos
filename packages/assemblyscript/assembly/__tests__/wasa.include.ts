
import { Console, fs, Process, CommandLine, fd, FileDescriptor } from '../wasa/mock/index';
import { Wasi } from "../wasi";
import { WasiResult } from '../wasa/index';

/** This file is included with tests so that the default globals are set up properly. */
beforeAll(() => {
    fs.fs.init();
})
