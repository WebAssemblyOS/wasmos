
// type asyncCallback<T> = (...args: any[], fn: (err: any, contents: T) => T) => void;
export function promisfy(fn: any): any {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, contents) => {
      if (err) reject(err);
      resolve(contents);
    })
  })
}
