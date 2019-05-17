
declare function __gc_allocate(
    size: usize,
    markFn: (ref: usize) => void
): usize;

declare function __gc_link(parentRef: usize, childRef: usize): void;

declare function __gc_mark(ref: usize): void;

declare function __gc_collect(): void;