export function hasFlag(val: u32, flag: u32): boolean {
    return popcnt(val & flag) > 0;
}