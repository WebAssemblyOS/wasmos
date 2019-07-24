import { stdout, Hello, World, readString } from './fixtures';
import { main as echo } from "../bin/basename";

describe("basename", (): void => {

	beforeEach((): void => {
		stdout.reset();
		Console.stdout.erase();
		CommandLine.reset();
		CommandLine.push("basename");
	})

	it("should return the last part of the path", (): void => {
		CommandLine.push("/home/bob/documents/secret.txt"); //
		echo(CommandLine.all())
		let str = "\n"; //Fixme
		let stdoutStr = readString(stdout)
		expect<u32>(Console.stdout.tell()).toBe(str.lengthUTF8 - 1, "No NUL character at the end of the string")
		Console.stdout.reset();
		expect<string>(readString(Console.stdout)).toBe(str)
		Console.stdout.reset();
		expect<string>(readString(Console.stdout)).toBe(stdoutStr);
	});

})
