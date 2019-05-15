import { JSONDecoder } from "../json/decoder";
import { JSONEncoder } from "../json/encoder";
import { JSON } from '../json';

var encoder: JSONEncoder;
const jsonStr = '{"hello":"world"}';



function roundripTest(jsonString: string, expectedString: string = ""): bool {
    expectedString = expectedString || jsonString;
    let buffer: Uint8Array = new Uint8Array(jsonString.lengthUTF8);
    let utf8ptr = jsonString.toUTF8();
    // TODO: std should expose memcpy?
    memory.copy(buffer.buffer.data, utf8ptr, buffer.byteLength);
    let decoder: JSONDecoder<JSONEncoder> = new JSONDecoder(encoder);
    decoder.deserialize(buffer);
    let resultBuffer = encoder.serialize();
    let resultString = String.fromUTF8(
        resultBuffer.buffer.data,
        resultBuffer.length
    );
    expect<string>(resultString).toStrictEqual(expectedString);
    expect<String>(encoder.toString()).toStrictEqual(expectedString);
    return true;
}

describe("JSON", (): void => {
    beforeAll(
        (): void => {
            encoder = new JSONEncoder();
        });
    it("round trip should produce the same string", (): void => {
        roundripTest(jsonStr, jsonStr);
    });

    describe("parse should handle", (): void => {

        it("strings", () => {
            let obj = JSON.parse(jsonStr);
            expect<string>(obj.getString("hello")).toStrictEqual("world");
        });

        it("arrays", () => {
            let str = '{"Hello": ["World"]}'
            let obj = JSON.parse(str);
            let arr = obj.getArray("Hello");
            expect<number>(arr.length).toBe(1)
            expect<string>(arr[0].val).toStrictEqual("World");
        });

        it("nested objects", () => {
            let str = '{"top level": { "Hello": "World" } }';
            let obj = JSON.parse(str);
            let topLevel = obj.getObject("top level");
            expect<number>(topLevel.keys.length).toBe(1);
            expect<string>(topLevel.getString("Hello")).toStrictEqual("World");
        });

        it("numbers", () => {
            let str = '{"pi": 3}'
            let obj = JSON.parse(str);
            let pi: i64 = <i64>obj.getNumber("pi");
            expect<i64>(pi).toBe(<i64>3);
        });

        it("booleans", () => {
            let str = '{"Hello": true }'
            let obj = JSON.parse(str);
            expect<bool>(obj.getBool("Hello")).toBe(true);
        });

        it("null", () => {
            let str = '{"Hello": null }'
            let obj = JSON.parse(str);
            expect<JSON.Value | null>(obj.getNull("Hello")).toBe(null);
        })
    });
});