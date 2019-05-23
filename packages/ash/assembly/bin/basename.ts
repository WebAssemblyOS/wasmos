import * as path from "../../../assemblyscript/assembly/wasa/mock/path";

export function main(args: string[]): void {
	if (args.length > 1) {
		let dirname = args[1];
		var filename = path.basename(dirname);
		Console.log(filename);
	}
}
