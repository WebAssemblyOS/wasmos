
const PATH_SEP: string = "/"

export function basename(path: string): string {
  return getPath(path)
}


export function dirname(path: string): string {
  return getPath(path, 1);
}

export function getPath(path: string, index: usize = 0): string {
  let paths = path.split(PATH_SEP);
  let path_index = Math.max(paths.length - 1 - index, 0);
  return paths[path_index]
}


export function join(paths: string[]): string {
  let paths_cleaned = [];
  for (let i: usize = 0; i< paths.length; i++){
    let path = paths[i];
    if (path.endsWith('/')) {
      path = path.slice(0, paths.length - 1);
    }
    if (path.startsWith("./")){
      path = path.slice(2)
    }
    paths_cleaned.push(path)
  }
  return paths_cleaned.join(PATH_SEP);
}
