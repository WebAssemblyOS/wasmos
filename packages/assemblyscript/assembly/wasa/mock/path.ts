export const PATH_SEP: string = "/"

export function basename(path: string): string {
  return path.substr(path.lastIndexOf("/") + 1);
}


export function dirname(path: string): string {
  if (path == PATH_SEP) {
    return path;
  }
  let res: string = path;
  if (path.endsWith(PATH_SEP)) {
    res = path.substr(0, path.length - 1);
  }
  res = res.substr(0, res.lastIndexOf(PATH_SEP));
  return res == "" ? PATH_SEP : res;
}

export function getPath(path: string, from: usize, to: usize): string {
  let paths: string[] = path.split(PATH_SEP);
  let start: usize = <usize>Math.max((from + paths.length) % paths.length, 0);
  let end: usize = <usize>Math.max((to + paths.length) % paths.length, 1);
  let res: string[] = paths.slice(start, end);
  let output = res.join(PATH_SEP);
  log<string>(output);
  return output.startsWith("/") ? output : "/" + output;
}


export function join(paths: string[]): string {
  let paths_cleaned: string[] = new Array<string>();
  for (let i: usize = 0; i < (paths.length as usize); i++) {
    let path: string = paths[i];
    if (path.endsWith(PATH_SEP) && !isAbsolute(path)) {
      path = path.substr(0, paths.length - 1);
    } else if (path == PATH_SEP) {
      path = "";
    }
    if (path.startsWith("./")) {
      path = path.substr(2)
    }
    paths_cleaned.push(path)
  }
  return paths_cleaned.join(PATH_SEP);
}

export function isAbsolute(path: string): bool {
  return path.startsWith(PATH_SEP);
}

export function relative(pathFrom: string, pathTo: string): string {
  //TODO
  return ""
}