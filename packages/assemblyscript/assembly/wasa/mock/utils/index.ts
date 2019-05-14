
const newLine: u8 = 10;

export class StringUtils {
  static isNewLine(ptr: usize): boolean {
    return load<u8>(ptr) == newLine;
  }

  static fromCString(cstring: usize, max: usize = 4096): string | null {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
    }
    if (size >= max && load<u8>(cstring + size) != 0) {
      return null;
    }
    return String.fromUTF8(cstring, size);
  }

  static fromCStringTilNewLine(cstring: usize, max: usize): string | null {
    let size: usize = 0;
    while (load<u8>(cstring + size) != 0 && size < max) {
      size++;
      if (this.isNewLine(cstring + size - 1)) {
        break;
      }
    }
    if (size >= max && load<u8>(cstring + size) != 0) {
      return null;
    }
    return String.fromUTF8(cstring, size);
  }
}