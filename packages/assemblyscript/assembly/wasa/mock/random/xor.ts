class RandomNumberGenerator {
  next(): u32 {
    return 0;
  }
}

//inspired by https://github.com/dubzzz/pure-rand/blob/master/src/generator/XorShift.ts

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
    // let a0 = this.s00 ^ (this.s00 << 23);
    // let a1 = this.s01 ^ ((this.s01 << 23) | (this.s00 >>> 9));
    // let b0 =
    //   a0 ^
    //   this.s10 ^
    //   ((a0 >>> 17) | (a1 << 15)) ^
    //   ((this.s10 >>> 26) | (this.s11 << 6));
    // let b1 = a1 ^ this.s11 ^ (a1 >>> 17) ^ (this.s11 >>> 26);
    // this.s01 = this.s11;
    // this.s00 = this.s10;
    // this.s11 = b1;
    // this.s10 = b0;
    return (this.s10++);
  }

  static fromSeed(seed: u32): XorShift128Plus {
    return new XorShift128Plus(-1, ~seed, 0, seed | 0);
  };
}
export { XorShift128Plus as RNG }
