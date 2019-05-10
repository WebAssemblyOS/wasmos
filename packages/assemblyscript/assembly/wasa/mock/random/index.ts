import { RNG } from "./xor";

export class Random {
    static RNG: RNG = RNG.fromSeed(84);

    /**
     * Fill a buffer with random data
     * @param buffer An array buffer
     */
    static randomFill(buffer: ArrayBuffer): void {
        for (let i = 0; i < buffer.byteLength; i++) {
            store<i8>(buffer.data + i, this.RNG.next());
        }
    }

    /**
     * Return an array of random bytes
     * @param len length
     */
    static randomBytes(len: usize): Uint8Array {
        let array = new Uint8Array(len);
        this.randomFill(array.buffer);
        return array;
    }

    static randomU32(): u32 {
        let len = sizeof<u32>();
        let array = this.randomBytes(len) as Uint32Array;
        return array[1];


    }
}