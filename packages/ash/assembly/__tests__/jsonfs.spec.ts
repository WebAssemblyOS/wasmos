import { Console, fs, Process, CommandLine } from '../../../assemblyscript/assembly/wasa/mock';
import { FileDescriptor, FileSystem } from '../../../assemblyscript/assembly/wasa/mock/fs';
import { parseJSON as addJSONtoFS, openStdout, Hello, World, testFile, open } from './fixtures';
import { Wasi } from "../../../assemblyscript/assembly/wasi";
import { fs_str } from "./simple_fs";

describe("fs from JSON", (): void => {

    beforeEach(() => {
        fs.fs = new FileSystem();
    });


    it("Should handle just a top level file", (): void => {
        let s = `{"hello": "world"}`;
        addJSONtoFS(s);
        expect<string>(open("/hello").readString().result).toStrictEqual("world");
    });

    it("Should handle just a top level directory", (): void => {
        let s = `{"www": { "hello": "world"}}`;
        addJSONtoFS(s);
        expect<string>(open("/www/hello").readString().result).toStrictEqual("world");
    });

    it("Should handle just a multi-level level directory", (): void => {
        let s =
            `{ "www":  \
                 { "test": \
                          { "hello": "world"}\
                }\
         }`;
        addJSONtoFS(s);
        expect<string>(open("/www/test/hello").readString().result).toStrictEqual("world");
    });

    it("should reset fs each time", () => {
        let res = fs.openFile("/hello");
        expect<bool>(res.failed).toBe(true);
        expect<Wasi.errno>(res.error).toBe(Wasi.errno.NOENT)
    });

    it("should handle imported string", () => {
        addJSONtoFS(fs_str);
        expect<string>(open("/home/bob/documents/secret.txt").readString().result).toStrictEqual("For my eyes only.\n No one else")
    })
});