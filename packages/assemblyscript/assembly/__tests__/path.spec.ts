import * as path from "../wasa/mock/path";

const ROOT: string = "/"
const HOME: string = "/home";

describe("path", (): void => {
    describe("dirname", (): void => {
        it("return root if passed root", (): void => {
            expect<string>(path.dirname(ROOT)).toStrictEqual(ROOT);
        });

        it("Should return root if passed a toplevel directory", (): void => {
            expect<string>(path.dirname(HOME)).toStrictEqual(ROOT);
        })
    });
});


