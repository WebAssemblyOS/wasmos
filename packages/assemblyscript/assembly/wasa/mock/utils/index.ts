

export class StringUtils {
    static readonly NUL: u8 = 0;
    static readonly EOT: u8 = 4;
    static readonly LF: u8 = 10;

    static isNewLine(ptr: usize): boolean {
        return load<u8>(ptr) == this.LF;
    }

    private static terminates(ptr: usize): bool {
        let char: u8 = load<u8>(ptr);
        return char == this.NUL || char == this.EOT
    }

    static fromCString(cstring: usize, max: usize = 4096): string | null {
        let size: usize = 0;
        while (!this.terminates(cstring + size) && size < max - 1) {
            size++;
        }
        if (size == 0) {
            return null
        }
        return String.fromUTF8(cstring, size);
    }

    static fromCStringTilNewLine(cstring: usize, max: usize): string | null {
        let size: usize = 0;
        while (!this.terminates(cstring + size) && size < max - 1) {
            if (this.isNewLine(cstring + size)) {
                break;
            }
            size++;
        }
        if (size == 0) {
            return null
        }
        return String.fromUTF8(cstring, size + 1);
    }
}