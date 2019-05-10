
/// see https://github.com/emscripten-core/emscripten/blob/e9c44b413781c0cdf3293bcc50894d9984930b5b/src/runtime_strings.js#L149
/*
* Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
* encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
* Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
* Parameters:
*   str: the Javascript string to copy.
*   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
*   outIdx: The starting offset in the array to begin the copying.
*   maxBytesToWrite: The maximum number of bytes this function can write to the array.
*                    This count should include the null terminator,
*                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
*                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
* Returns the number of bytes written, EXCLUDING the null terminator.
*/
export function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
        return 0;

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
    for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
            var u1 = str.charCodeAt(++i);
            u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u;
        } else if (u <= 0x7FF) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 0xC0 | (u >> 6);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 0xE0 | (u >> 12);
            outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        } else {
            if (outIdx + 3 >= endIdx) break;
            if (u >= 0x200000) throw new Error('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');

            outU8Array[outIdx++] = 0xF0 | (u >> 18);
            outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
            outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        }
    }
    // Null-terminate the pointer to the buffer.
    outU8Array[outIdx] = 0;
    return outIdx - startIdx;
}

export function toUint8Array(str: string): Uint8Array {
    let maxSize = str.length * 4 + 1;
    let tmp = new Uint8Array(maxSize);
    let size = stringToUTF8Array(str, tmp, 0, maxSize)
    return tmp.slice(0, size);
}

export function fromUTF8Array(data: Uint8Array): string { // array of bytes
    var str = '',
        i;

    for (i = 0; i < data.length; i++) {
        var value = data[i];
        if (value < 0x80) {
            str += String.fromCharCode(value);
        } else if (value > 0xBF && value < 0xE0) {
            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
            i += 1;
        } else if (value > 0xDF && value < 0xF0) {
            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
            i += 2;
        } else {
            // surrogate pair
            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
            i += 3;
        }
    }

    return str;
}
