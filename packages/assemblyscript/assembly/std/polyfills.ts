export function bswap<T>(value: T): T {
  if (isInteger<T>()) {
    if (sizeof<T>() == 2) {
      // @ts-ignore valid asc
      return <T>((value << 8) | ((value >> 8) & <T>0x00FF));
    }
    if (sizeof<T>() == 4) {
      // @ts-ignore valid asc
      return <T>(
        // @ts-ignore valid asc
        rotl<u32>(<u32>value & 0xFF00FF00, 8) |
        // @ts-ignore valid asc
        rotr<u32>(<u32>value & 0x00FF00FF, 8)
      );
    }
    if (sizeof<T>() == 8) {
      // @ts-ignore valid asc
      let a = (<u64>value >> 8) & 0x00FF00FF00FF00FF;
      // @ts-ignore valid asc
      let b = (<u64>value & 0x00FF00FF00FF00FF) << 8;
      let v = a | b;

      a = (v >> 16) & 0x0000FFFF0000FFFF;
      b = (v & 0x0000FFFF0000FFFF) << 16;
      // @ts-ignore valid asc
      return <T>rotr<u64>(a | b, 32);
    }
    return value;
  }
  assert(false);
  return value;
}
// @ts-ignore decorators is correct
@inline
export function bswap16<T>(value: T): T {
  if (isInteger<T>() && sizeof<T>() <= 4) {
    if (sizeof<T>() == 2) {
      // @ts-ignore valid asc
      return <T>((value << 8) | ((value >> 8) & <T>0x00FF));
    } else if (sizeof<T>() == 4) {
      // @ts-ignore valid asc
      return <T>(((value << 8) & <T>0xFF00) | ((value >> 8) & <T>0x00FF) | (value & <T>0xFFFF0000));
    }
    return value;
  }
  assert(false);
  return value;
}
