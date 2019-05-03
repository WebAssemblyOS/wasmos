import { JSONDecoder } from "../../node_modules/assemblyscript-json/assembly/decoder";
import { JSONEncoder } from "../../node_modules/assemblyscript-json/assembly/encoder";

var encoder: JSONEncoder;
const jsonStr = '{"hello":"world"}';
beforeAll(
    (): void => {
        encoder = new JSONEncoder();
    });


function roundripTest(jsonString: string, expectedString: string = ""): bool {
    log("--------" + jsonString + (expectedString ? " " + expectedString : ""));
    expectedString = expectedString || jsonString;
    let buffer: Uint8Array = new Uint8Array(jsonString.lengthUTF8);
    let utf8ptr = jsonString.toUTF8();
    // TODO: std should expose memcpy?
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = load<u8>(utf8ptr + i);
    }
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

describe("Json", (): void => {
    it("simple hello world", (): void => {
        roundripTest(jsonStr, jsonStr);
    });
});