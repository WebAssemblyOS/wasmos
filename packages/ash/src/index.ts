var FontFaceObserver = require("fontfaceobserver");
// import { EventManager, Terminal } from "./terminal";
import { Terminal } from "xterm";
import * as fullscreen from "xterm/lib/addons/fullscreen/fullscreen";
import { Process } from "@wasmos/kernel/src";
import * as BrowserFS from "browserfs";

BrowserFS.install(window);
// Configures BrowserFS to use the LocalStorage file system.

import { fs, init } from "@wasmos/fs/src";
//
// interface TestWindow extends Window {
//   terminal: Terminal;
//   Process: typeof Process;
//   fs: typeof fs;
// }
//
// function compileStreaming(
//   source: Response | Promise<Response>
// ): Promise<WebAssembly.Module> {
//   return (WebAssembly as any).compileStreaming(source);
// }
//
// import { Terminal as TerminalType } from "xterm";
//
// export interface IWindowWithTerminal extends Window {
//   terminal: TerminalType;
// }
// declare let window: IWindowWithTerminal;
//
// Terminal.applyAddon(fullscreen);
//
// let terminal: Terminal;
//
// const terminalContainer = document.getElementById("terminal-container");
//
// function createTerminal(): void {
//   // Clean terminal
//   while (terminalContainer.children.length) {
//     terminalContainer.removeChild(terminalContainer.children[0]);
//   }
//   terminal = new Terminal({});
//   window.terminal = terminal; // Expose `terminal` to window for debugging purposes
//
//   terminal.open(terminalContainer);
//
//   // fit is called within a setTimeout, cols and rows need this.
//   setTimeout(() => {
//     initOptions(terminal);
//     // Set terminal size again to set the specific dimensions on the demo
//     runFakeTerminal();
//     terminal.toggleFullScreen();
//   }, 0);
// }
//
// function runFakeTerminal(): void {
//   if (terminal._initialized) {
//     return;
//   }
//
//   terminal._initialized = true;
//
//   terminal.prompt = () => {
//     terminal.write("\r\n$ ");
//   };
//
//   terminal.writeln("Welcome to xterm.js");
//   terminal.writeln(
//     "This is a local terminal emulation, without a real terminal in the back-end."
//   );
//   terminal.writeln("Type some keys and commands to play around.");
//   terminal.writeln("");
//   terminal.prompt();
//
//   terminal._core.register(
//     terminal.addDisposableListener("key", (key, ev) => {
//       const printable =
//         !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
//
//       if (ev.keyCode === 13) {
//         terminal.prompt();
//       } else if (ev.keyCode === 8) {
//         // Do not delete the prompt
//         if (terminal.x > 2) {
//           terminal.write("\b \b");
//         }
//       } else if (printable) {
//         terminal.write(key);
//       }
//     })
//   );
//
//   terminal._core.register(
//     terminal.addDisposableListener("paste", (data, ev) => {
//       terminal.write(data);
//     })
//   );
// }
//
// function initOptions(term: TerminalType): void {
//   const blacklistedOptions = [
//     // Internal only options
//     "cancelEvents",
//     "convertEol",
//     "debug",
//     "handler",
//     "screenKeys",
//     "termName",
//     "useFlowControl",
//     // Complex option
//     "theme"
//   ];
//   const stringOptions = {
//     bellSound: null,
//     bellStyle: ["none", "sound"],
//     cursorStyle: ["block", "underline", "bar"],
//     experimentalCharAtlas: ["none", "static", "dynamic"],
//     fontFamily: null,
//     fontWeight: [
//       "normal",
//       "bold",
//       "100",
//       "200",
//       "300",
//       "400",
//       "500",
//       "600",
//       "700",
//       "800",
//       "900"
//     ],
//     fontWeightBold: [
//       "normal",
//       "bold",
//       "100",
//       "200",
//       "300",
//       "400",
//       "500",
//       "600",
//       "700",
//       "800",
//       "900"
//     ],
//     rendererType: ["dom", "canvas"]
//   };
//   const options = Object.keys((<any>term)._core.options);
//   const booleanOptions = [];
//   const numberOptions = [];
//   options
//     .filter(o => blacklistedOptions.indexOf(o) === -1)
//     .forEach(o => {
//       switch (typeof term.getOption(o)) {
//         case "boolean":
//           booleanOptions.push(o);
//           break;
//         case "number":
//           numberOptions.push(o);
//           break;
//         default:
//           if (Object.keys(stringOptions).indexOf(o) === -1) {
//             console.warn(`Unrecognized option: "${o}"`);
//           }
//       }
//     });
// }
//
// async function main() {
//   await init("index.zip");
//   (window as TestWindow).fs = fs;
//   createTerminal();
//   let contents = await fs.readdir(".");
//   for (let dir of contents) {
//     console.log(await fs.readdir(dir));
//   }
// }
// main();
