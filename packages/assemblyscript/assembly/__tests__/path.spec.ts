import * as path from "../wasa/mock/path";

let ROOT: string;
let HOME: string;
let SRC: string;
let SIMPLE_PATH: string;

beforeAll((): void => {
    ROOT = "/"
    HOME = "/home";
    SRC = "./src";
    SIMPLE_PATH = "/home/foo"

})

describe("path", (): void => {
    describe("dirname", (): void => {
        it("return root if passed root", (): void => {
            expect<string>(path.dirname(ROOT)).toStrictEqual(ROOT);
        });

        it("Should return root if passed a toplevel directory", (): void => {
            expect<string>(path.dirname(HOME)).toStrictEqual(ROOT);
        })
        it("Should return full path of parent directory", (): void => {
            expect<string>(path.dirname(SIMPLE_PATH)).toStrictEqual(HOME);
        })
    });

    describe("basename", (): void => {
        it("should return basename", (): void => {
            expect<string>(path.basename(HOME)).toStrictEqual("home");
        });

    });

    describe("join", (): void => {
        it("should handle relative links", (): void => {
            log<string>("HELLO")
            let paths: string[] = new Array<string>();
            paths.push(HOME)
            log<string>(HOME);
            paths.push(SRC);
            log(paths.length)
            // expect<string>(paths[0]).not.toBe(null);
            let res = path.join(paths);
            expect<string>(res).not.toBe(null);
            expect<string>(res).toStrictEqual(HOME + path.PATH_SEP + SRC.substr(2));
        });
    });
});


