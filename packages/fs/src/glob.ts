import __glob from "glob";

export function promisfy<T>(fn: any) {
  return (...args: any[]) =>
    new Promise<T>((resolve: any, reject: any) => {
      fn(...args, (error: any, content: any) => {
        if (error) reject(error);
        resolve(content);
      });
    });
}
function _glob(
  pattern: string,
  options: any,
  cb: (err: Error, matches: string[]) => void
) {
  if (typeof options === "function") (cb = options), (options = {});
  if (!options) options = {};
  return new __glob.Glob(pattern, options, cb);
}

let glob: (glob: string)=> Promise<string[]> = promisfy<string[]>(_glob);
export {glob}
