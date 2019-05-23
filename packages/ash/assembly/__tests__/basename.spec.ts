import { stdout, Hello, World, readString } from './fixtures';
import { main as echo } from "../bin/basename";

describe("basename", (): void => {

  beforeEach((): void => {
      stdout.reset();
          Console.stdout.erase();
	      CommandLine.reset();
	          CommandLine.push("basename");
		    })

		      it("should print newline by default", (): void => {
		          CommandLine.push(Hello)
			      CommandLine.push(World)
			          echo(CommandLine.all())
				      let str = Hello + " " + World + "\n";
				          let stdoutStr = readString(stdout)
					      expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
						          Console.stdout.reset();
							      expect<string>(readString(Console.stdout)).toBe(Hello + " " + World + "\n")
								          Console.stdout.reset();
									      expect<string>(readString(Console.stdout)).toBe(stdoutStr);
										        });

											})
