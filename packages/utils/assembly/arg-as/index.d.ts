declare namespace ASModule {
  type i8 = number;
  type i16 = number;
  type i32 = number;
  type u8 = number;
  type u16 = number;
  type u32 = number;
  type f32 = number;
  type f64 = number;
  type bool = any;
  const MAX_BLENGTH: i32;
  const HEADER_SIZE: u32;
  function allocateUnsafe(byteLength: i32): ArrayBuffer;
  function reallocateUnsafe(buffer: ArrayBuffer, newByteLength: i32): ArrayBuffer;
  function allocateUnsafe(length: i32): String;
  function copyUnsafe(dest: String, destOffset: u32, src: String, srcOffset: u32, len: u32): void;
  const MAX_DOUBLE_LENGTH: i32;
  const NaN: f64;
  const Infinity: f64;
  function abort(message: String, fileName: String, lineNumber: u32, columnNumber: u32): void;
  const INITIAL_CAPACITY: i32;
  const FILL_FACTOR: f64;
  const FREE_FACTOR: f64;
  const EMPTY: u32;
  const BUCKET_SIZE: u32;
  namespace memory {
    function allocate(size: u32): u32;
  }
  function memmove(dest: u32, src: u32, n: u32): void;
  function memset(dest: u32, c: u8, n: u32): void;
  const HEADER_SIZE: u32;
  const MAX_LENGTH: i32;
  function compareUnsafe(str1: String, offset1: u32, str2: String, offset2: u32, len: u32): i32;
  enum CharCode {
    PLUS = 43,
    MINUS = 45,
    DOT = 46,
    _0 = 48,
    _1 = 49,
    _2 = 50,
    _3 = 51,
    _4 = 52,
    _5 = 53,
    _6 = 54,
    _7 = 55,
    _8 = 56,
    _9 = 57,
    A = 65,
    B = 66,
    E = 69,
    N = 78,
    O = 79,
    X = 88,
    Z = 90,
    a = 97,
    b = 98,
    e = 101,
    n = 110,
    o = 111,
    x = 120,
    z = 122,
  }
  enum ArgType {
    Flag,
    String,
    Int,
    Float,
  }
  class Argas {
    constructor(desc: String);
    constructor(desc: String);
    addOption(name: String, type: i32, desc: String, _shortName: String, optional: bool): void;
    parse(args: String): void;
    toString(): String;
  }
  function computeSize(byteLength: i32): u32;
  const AL_MASK: u32;
  const MAX_SIZE_32: u32;
  const FNV_OFFSET: u32;
  const FNV_PRIME: u32;
  function hashStr(key: String): u32;
  function memcpy(dest: u32, src: u32, n: u32): void;
  const AL_BITS: u32;
  const AL_SIZE: u32;
}
// export ASModule;
