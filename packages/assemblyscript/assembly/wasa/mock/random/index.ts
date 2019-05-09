import { RNG } from "./xor";

export class Random {
    static RNG: RNG = RNG.fromSeed(42);

    /**
     * Fill a buffer with random data
     * @param buffer An array buffer
     */
    static randomFill(buffer: ArrayBuffer): void {
        for (let i = 0; i < buffer.byteLength; i++) {
            store<i8>(buffer.data, this.RNG.next(), i);
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
}