export function main(args: string[]): void {
	if (args.length > 1) {
		let dirname = args[1];
		var path = require('path');
		var filename = path.basename(dirname);
		console.log(filename);
	}
}
