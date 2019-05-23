function stringcomp(s1: string, s2: string): i32 {
  if (s1 > s2) {
    return 1;
  } else if (s1 < s2) {
    return -1
  }

  return 0;
}


export function main(args: string[]): void {

  if (args.length > 1) {

    let arr: string[] = [];

    for (let i: i32 = 1; i < args.length; i++) {

      let fd = fs.openFile(args[i]);

      if (!fd.failed) {

        let line = fd.result.readLine();
        while (!line.failed) {
          arr.push(line.result);
          line = fd.result.readLine();
        }

      } else {
        Console.error("sort: " + args[i] + ": No such file or directory");
      }



    }

    let sorted = arr.sort(stringcomp);

    for (let j: i32 = 0; j < sorted.length; j++) {
      // log<string>(sorted[j]);
      Console.write(sorted[j]);

    }



  }
}

