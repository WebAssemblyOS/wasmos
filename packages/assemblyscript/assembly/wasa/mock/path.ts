const PATH_SEP: string = "/"
export function basename(path: string): string {
  return getPath(path)
}


export function dirname(path: string): string {
  return getPath(path, 1);
}

export function getPath(path: string, index: usize = 0): string {
  let paths: string[] = path.split(PATH_SEP);
  let path_index: usize = <usize>Math.max(paths.length - 1 - index, 0);
  return paths[path_index]
}


export function join(paths: string[]): string {
  let paths_cleaned: string[] = [];
  for (let i: usize = 0; i < (paths.length as usize); i++) {
    let path: string = paths[i];
    if (path.endsWith('/')) {
      path = path.slice(0, paths.length - 1);
    }
    if (path.startsWith("./")) {
      path = path.slice(2)
    }
    paths_cleaned.push(path)
  }
  return paths_cleaned.join(PATH_SEP);
}

export function isAbsolute(path: string): bool {
  return path.startsWith("/");
}

export function relative(pathFrom: string, pathTo: string): string {
  //TODO
  return ""
}