import { memcmp, memmove, memset } from "./internal/memory";
// @ts-ignore valid asc
@builtin export declare const HEAP_BASE: usize; // tslint:disable-line

/* tslint:disable */

export namespace memory {
  // @ts-ignore decorators is correct
  @builtin export declare function size(): i32;
  // @ts-ignore decorators is correct
  @builtin export declare function grow(pages: i32): i32;

  // @ts-ignore decorators is correct
  @builtin @inline
  export function fill(dest: usize, c: u8, n: usize): void { // see: musl/src/string/memset
    memset(dest, c, n); // fallback if "bulk-memory" isn't enabled
  }

  // @ts-ignore decorators is correct
  @builtin @inline
  export function copy(dest: usize, src: usize, n: usize): void { // see: musl/src/string/memmove.c
    memmove(dest, src, n); // fallback if "bulk-memory" isn't enabled
  }

  // @ts-ignore decorators is correct
  @inline export function compare(vl: usize, vr: usize, n: usize): i32 { // see: musl/src/string/memcmp.c
    return memcmp(vl, vr, n);
  }

  // Passive segments

  // export function init(segmentIndex: u32, srcOffset: usize, dstOffset: usize, n: usize): void {
  //   __memory_init(segmentIndex, srcOffset, dstOffset);
  // }

  // export function drop(segmentIndex: u32): void {
  //   __memory_drop(segmentIndex);
  // }

  // Allocator

  // @ts-ignore decorators is correct
  @inline export function allocate(size: usize): usize {
    // @ts-ignore valid asc
    if (isDefined(__memory_allocate)) return __memory_allocate(size);
    WARNING("Calling 'memory.allocate' requires a memory manager to be present.");
    return <usize>unreachable();
  }

  // @ts-ignore decorators is correct
  @inline export function free(ptr: usize): void {
    // @ts-ignore valid asc
    if (isDefined(__memory_free)) { __memory_free(ptr); return; }
    WARNING("Calling 'memory.free' requires a memory manager to be present.");
    unreachable();
  }

  // @ts-ignore decorators is correct
  @inline export function reset(): void {
    // @ts-ignore valid asc
    if (isDefined(__memory_reset)) { __memory_reset(); return; }
    unreachable();
  }
}
