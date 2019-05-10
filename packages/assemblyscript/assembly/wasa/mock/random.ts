class RandomNumberGenerator {
  next(): u32 {
    return 0;
  }
}

//inspired by https://github.com/dubzzz/pure-rand/blob/master/src/generator/XorShift.ts

type RNG = RandomNumberGenerator;

class XorShift128Plus extends RandomNumberGenerator {
  constructor(
    private s01: u32,
    private s00: u32,
    private s11: u32,
    private s10: u32
  ) {
    super();
  }
  min(): u32 {
    return -0x80000000;
  }
  max(): u32 {
    return 0x7fffffff;
  }
  next(): u32 {
    const a0 = this.s00 ^ (this.s00 << 23);
    const a1 = this.s01 ^ ((this.s01 << 23) | (this.s00 >>> 9));
    const b0 =
      a0 ^
      this.s10 ^
      ((a0 >>> 17) | (a1 << 15)) ^
      ((this.s10 >>> 26) | (this.s11 << 6));
    const b1 = a1 ^ this.s11 ^ (a1 >>> 17) ^ (this.s11 >>> 26);
    this.s01 = this.s11;
    this.s00 = this.s10;
    this.s11 = b1;
    this.s10 = b0;
    return (b0 + this.s10) | 0;
  }

  static fromSeed(seed: u32): XorShift128Plus {
    return new XorShift128Plus(-1, ~seed, 0, seed | 0);
  };
}
export {XorShift128Plus as RNG}

