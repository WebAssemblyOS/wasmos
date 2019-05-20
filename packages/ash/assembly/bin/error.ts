
export function main(): i32 {
    let code = Process.error_flag;
    if (code != 0) {
        Process.error_flag = 0;
        return 1;
    }
    else {

        return 0;
    }
}
