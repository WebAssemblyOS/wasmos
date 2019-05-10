import { exec } from "../src";
// let opts = Compiler.opts;

console.log(process.argv);
debugger;
exec(process.argv[2], process.argv.slice(3).join(" "));
