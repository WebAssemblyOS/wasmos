import _glob from "glob";

export function promisfy<T>(fn: any) {
  return (...args: any[]) =>
    new Promise<T>((resolve: any, reject: any) => {
      fn(...args, (error: any, content: any) => {
        if (error) reject(error);
        resolve(content);
      });
    });
}
function glob(
  pattern: string,
  options: any,
  cb: (err: Error, matches: string[]) => void
) {
  if (typeof options === "function") (cb = options), (options = {});
  if (!options) options = {};
  return new _glob.Glob(pattern, options, cb);
}

let Glob = promisfy<string[]>(glob);

export async function assemblyFolders(startingDir: string): Promise<string[]> {
  let dir = startingDir + "/node_modules/**/**/assembly";
  let res = await Glob(dir);
  return res.filter(
    v => !(v.endsWith("std/types/assembly") || v.endsWith("std/assembly"))
  );
}
assemblyFolders(process.argv[2]);
