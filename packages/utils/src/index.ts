export function promisfy<T>(fn: any) {
  return (...args: any[]) =>
    new Promise<T>((resolve: any, reject: any) => {
      fn(...args, (error: any, content: any) => {
        if (error) reject(error);
        resolve(content);
      });
    });
}
