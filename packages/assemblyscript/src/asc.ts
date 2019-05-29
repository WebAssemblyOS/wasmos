/**
 * Compiler frontend for node.js
 *
 * Uses the low-level API exported from src/index.ts so it works with the compiler compiled to
 * JavaScript as well as the compiler compiled to WebAssembly (eventually). Runs the sources
 * directly through ts-node if distribution files are not present (indicated by a `-dev` version).
 *
 * Can also be packaged as a bundle suitable for in-browser use with the standard library injected
 * in the build step. See dist/asc.js for the bundle and webpack.config.js for building details.
 *
 * @module cli/asc
 */

// Use "." instead of "/" as cwd in browsers

import * as fs from "fs";
import * as path from "path";
import * as utf8 from "@protobufjs/utf8";
import colorsUtil from "assemblyscript/cli/util/colors";
import * as optionsUtil from "assemblyscript/cli/util/options";
import { mkdirp } from "./mkdirp";

const EOL = (() => process.platform === "win32" ? "\r\n" : "\n")();

// Emscripten adds an `uncaughtException` listener to Binaryen that results in an additional
// useless code fragment on top of an actual error. suppress this:
if (process.removeAllListeners) process.removeAllListeners("uncaughtException");



import * as assemblyscript from "assemblyscript/dist/assemblyscript";
import * as glob from "glob";
import assert from "assert";


/** Whether this is a webpack bundle or not. */
// export const isBundle = typeof BUNDLE_VERSION === "string";

/** Whether asc runs the sources directly or not. */
// exports.isDev = isDev;

/** AssemblyScript version. */
export const version = require("../node_modules/assemblyscript/package.json").version;

/** Available CLI options. */
export const options = require("../node_modules/assemblyscript/cli/asc.json");

/** Common root used in source maps. */
export const sourceMapRoot = "assemblyscript:///";

/** Prefix used for library files. */
export const libraryPrefix = assemblyscript.LIBRARY_PREFIX;

/** Default Binaryen optimization level. */
export const defaultOptimizeLevel = 2;

/** Default Binaryen shrink level. */
export const defaultShrinkLevel = 1;

/** Bundled library files. */
export const libraryFiles = (() => { // set up if not a bundle
    const libDir = path.join(__dirname, "..", "node_modules", "assemblyscript", "std", "assembly");
    let libFiles = glob.sync("**/!(*.d).ts", { cwd: libDir });
    const bundled = {};
    libFiles.forEach(file => bundled[file.replace(/\.ts$/, "")] = fs.readFileSync(path.join(libDir, file), "utf8"));
    return bundled;
})();

/** Bundled definition files. */
export const definitionFiles = (() => { // set up if not a bundle
    const stdDir = path.join(__dirname, "..", "..", "..", "types");
    return {
        "assembly": fs.readFileSync(path.join(stdDir, "assembly", "index.d.ts"), "utf8")
    };
})();

/** Convenience function that parses and compiles source strings directly. */
export function compileString(sources, options) {
    if (typeof sources === "string") sources = { "input.ts": sources };
    const output = Object.create({
        stdout: createMemoryStream(),
        stderr: createMemoryStream()
    });
    var argv = [
        "--binaryFile", "binary",
        "--textFile", "text",
    ];
    Object.keys(options || {}).forEach(key => {
        var val = options[key];
        if (Array.isArray(val)) val.forEach(val => argv.push("--" + key, String(val)));
        else argv.push("--" + key, String(val));
    });
    main(argv.concat(Object.keys(sources)), {
        stdout: output.stdout,
        stderr: output.stderr,
        readFile: name => sources.hasOwnProperty(name) ? sources[name] : null,
        writeFile: (name, contents) => output[name] = contents,
        listFiles: () => []
    });
    return output;
}

/** Runs the command line utility using the specified arguments array. */
export function main(argv, options, callback?) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options) {
        options = {};
    }

    const stdout = options.stdout || process.stdout;
    const stderr = options.stderr || process.stderr;
    const readFile = options.readFile || readFileNode;
    const writeFile = options.writeFile || writeFileNode;
    const listFiles = options.listFiles || listFilesNode;
    const stats = options.stats || createStats();

    // Output must be specified if not present in the environment
    if (!stdout) throw Error("'options.stdout' must be specified");
    if (!stderr) throw Error("'options.stderr' must be specified");
    let config = require(__dirname + "/../node_modules/assemblyscript/cli/asc.json");
    const opts = optionsUtil.parse(argv, config);
    const args = opts.options;
    argv = opts.arguments;
    if (args.noColors) {
        colorsUtil.stdout.supported =
            colorsUtil.stderr.supported = false;
    } else {
        colorsUtil.stdout = colorsUtil.from(stdout);
        colorsUtil.stderr = colorsUtil.from(stderr);
    }

    // Check for unknown arguments
    if (opts.unknown.length) {
        opts.unknown.forEach(arg => {
            stderr.write(colorsUtil.stderr.yellow("WARN: ") + "Unknown option '" + arg + "'" + EOL);
        });
    }

    // Check for trailing arguments
    if (opts.trailing.length) {
        stderr.write(colorsUtil.stderr.yellow("WARN: ") + "Unsupported trailing arguments: " + opts.trailing.join(" ") + EOL);
    }

    // Use default callback if none is provided
    if (!callback) callback = function defaultCallback(err) {
        var code = 0;
        if (err) {
            stderr.write(colorsUtil.stderr.red("ERROR: ") + err.stack.replace(/^ERROR: /i, "") + EOL);
            code = 1;
        }
        return code;
    };

    // Just print the version if requested
    if (args.version) {
        stdout.write("Version " + version + EOL);
        return callback(null);
    }
    // Print the help message if requested or no source files are provided
    if (args.help || !argv.length) {
        var out = args.help ? stdout : stderr;
        var color = args.help ? colorsUtil.stdout : colorsUtil.stderr;
        out.write([
            color.white("SYNTAX"),
            "  " + color.cyan("asc") + " [entryFile ...] [options]",
            "",
            color.white("EXAMPLES"),
            "  " + color.cyan("asc") + " hello.ts",
            "  " + color.cyan("asc") + " hello.ts -b hello.wasm -t hello.wat",
            "  " + color.cyan("asc") + " hello1.ts hello2.ts -b -O > hello.wasm",
            "",
            color.white("OPTIONS"),
        ].concat(
            optionsUtil.help(options, { indent: 24, eol: EOL })
        ).join(EOL) + EOL);
        return callback(null);
    }

    // I/O must be specified if not present in the environment
    if (!fs.readFileSync) {
        if (readFile === readFileNode) throw Error("'options.readFile' must be specified");
        if (writeFile === writeFileNode) throw Error("'options.writeFile' must be specified");
        if (listFiles === listFilesNode) throw Error("'options.listFiles' must be specified");
    }

    // Set up base directory
    const baseDir = args.baseDir ? path.resolve(args.baseDir as string) : ".";

    // Set up transforms
    const transforms = [];
    if (args.transform) {
        (args.transform as string[]).forEach(transform =>
            transforms.push(
                require(
                    path.isAbsolute(transform = transform.trim())
                        ? transform
                        : path.join(process.cwd(), transform)
                )
            )
        );
    }
    function applyTransform(name, ...args) {
        transforms.forEach(transform => {
            if (typeof transform[name] === "function") transform[name](...args);
        });
    }

    // Begin parsing
    var parser = null;

    let glob = require("glob");

    //maps package names to parent directory
    let packages = new Map<string, string>();

    function isPackage(name) {
        for (let _package of packages.keys()) {
            if ((new RegExp(_package)).test(name)) {
                return true;
            }
        }
        return false;
    }
    if (args.path) {
        for (let _path of args.path as string[]) {
            let libFiles = glob.sync(`${_path}/**/assembly/index.ts`, { cwd: baseDir });
            libFiles = libFiles.filter((x) => !(/\/std/.test(x)))
                .filter(x => !(/\_\_.*\_\_/.test(x)))
                .filter(x => !(/\.d\.ts$/.test(x)));
            libFiles.forEach(file => {
                let libPath = file.substring(file.lastIndexOf(_path))
                let regex = new RegExp(`.*${_path}/(.*)\/assembly\/(.*)`);
                libPath = libPath.replace(regex, '$1/$2');
                packages.set(libPath.substring(0, libPath.indexOf("/")), _path)
                libPath = libPath.replace(/\.ts$/, "");
                if (!libraryFiles[libPath]) {
                    libraryFiles[libPath] = readFile(file, baseDir);
                    assert(libraryFiles[libPath] != null)
                    stats.parseCount++;
                    stats.parseTime += measure(() => {
                        parser = assemblyscript.parseFile(
                            libraryFiles[libPath],
                            libraryPrefix + libPath + ".ts",
                            false,
                            parser
                        );
                    });
                }
            })
        }
    }
    // Include library files
    if (!args.noLib) {
        Object.keys(libraryFiles).forEach(libPath => {
            if (libPath.indexOf("/") >= 0) return; // in sub-directory: imported on demand
            stats.parseCount++;
            stats.parseTime += measure(() => {
                parser = assemblyscript.parseFile(
                    libraryFiles[libPath],
                    libraryPrefix + libPath + ".ts",
                    false,
                    parser
                );
            });
        });
    } else { // always include builtins
        stats.parseCount++;
        stats.parseTime += measure(() => {
            parser = assemblyscript.parseFile(
                libraryFiles["builtins"],
                libraryPrefix + "builtins.ts",
                false,
                parser
            );
        });
    }
    const customLibDirs = [];
    if (args.lib) {
        let lib: string | string[] = args.lib as string | string[];
        if (typeof lib === "string") lib = lib.split(",");
        Array.prototype.push.apply(customLibDirs, lib.map(lib => lib.trim()));
        for (let i = 0, k = customLibDirs.length; i < k; ++i) { // custom
            let libDir = customLibDirs[i];
            let libFiles;
            if (libDir.endsWith(".ts")) {
                libFiles = [path.basename(libDir)];
                libDir = path.dirname(libDir);
            } else {
                libFiles = listFiles(libDir);
            }
            for (let j = 0, l = libFiles.length; j < l; ++j) {
                let libPath = libFiles[j];
                let libText = readFile(libPath, libDir);
                if (libText === null) return callback(Error("Library file '" + libPath + "' not found."));
                stats.parseCount++;
                libraryFiles[libPath.replace(/\.ts$/, "")] = libText
                stats.parseTime += measure(() => {
                    parser = assemblyscript.parseFile(
                        libText,
                        libraryPrefix + libPath,
                        false,
                        parser
                    );
                });
            }
        }
    }

    // Parses the backlog of imported files after including entry files
    function parseBacklog() {
        var sourcePath, sourceText;
        while ((sourcePath = parser.nextFile()) != null) {

            // Load library file if explicitly requested
            if (sourcePath.startsWith(libraryPrefix)) {
                const plainName = sourcePath.substring(libraryPrefix.length);
                const indexName = sourcePath.substring(libraryPrefix.length) + "/index";
                if (libraryFiles.hasOwnProperty(plainName)) {
                    sourceText = libraryFiles[plainName];
                    sourcePath = libraryPrefix + plainName + ".ts";
                } else if (libraryFiles.hasOwnProperty(indexName)) {
                    sourceText = libraryFiles[indexName];
                    sourcePath = libraryPrefix + indexName + ".ts";
                } else {
                    for (let i = 0, k = customLibDirs.length; i < k; ++i) {
                        sourceText = readFile(plainName + ".ts", customLibDirs[i]);
                        if (sourceText !== null) {
                            sourcePath = libraryPrefix + plainName + ".ts";
                            break;
                        } else {
                            sourceText = readFile(indexName + ".ts", customLibDirs[i]);
                            if (sourceText !== null) {
                                sourcePath = libraryPrefix + indexName + ".ts";
                                break;
                            }
                        }
                    }
                }

                // Otherwise try nextFile.ts, nextFile/index.ts, ~lib/nextFile.ts, ~lib/nextFile/index.ts
            } else {
                const plainName = sourcePath;
                const indexName = sourcePath + "/index";
                sourceText = readFile(plainName + ".ts", baseDir);
                if (sourceText !== null) {
                    sourcePath = plainName + ".ts";
                } else {
                    sourceText = readFile(indexName + ".ts", baseDir);
                    if (sourceText !== null) {
                        sourcePath = indexName + ".ts";
                    } else if (!plainName.startsWith(".")) {
                        if (libraryFiles.hasOwnProperty(plainName)) {
                            sourceText = libraryFiles[plainName];
                            sourcePath = libraryPrefix + plainName + ".ts";
                        } else if (libraryFiles.hasOwnProperty(indexName)) {
                            sourceText = libraryFiles[indexName];
                            sourcePath = libraryPrefix + indexName + ".ts";
                        } else {
                            for (let i = 0, k = customLibDirs.length; i < k; ++i) {
                                const dir = customLibDirs[i];
                                sourceText = readFile(plainName + ".ts", customLibDirs[i]);
                                if (sourceText !== null) {
                                    sourcePath = libraryPrefix + plainName + ".ts";
                                    break;
                                } else {
                                    sourceText = readFile(indexName + ".ts", customLibDirs[i]);
                                    if (sourceText !== null) {
                                        sourcePath = libraryPrefix + indexName + ".ts";
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*
            In this case the library wasn't found so we check paths
            */
            if (sourceText == null && args.path && isPackage(sourcePath)) {
                for (let _path of args.path as string[]) {
                    console.log(`Looking for ${sourcePath} in ${_path}`);
                    let realPath = (_p) => _p.replace(/\~lib\/([^/]*)\/(.*)/, `${_path}/$1/assembly/$2`);
                    const plainName = sourcePath;
                    const indexName = sourcePath + "/index";
                    sourceText = readFile(realPath(plainName) + ".ts", baseDir);
                    if (sourceText !== null) {
                        sourcePath = plainName + ".ts";
                    } else {
                        sourceText = readFile(realPath(indexName) + ".ts", baseDir);
                        if (sourceText !== null) {
                            sourcePath = indexName + ".ts";
                        }
                    }
                    if (sourceText !== null) {
                        console.log(`Found ${sourcePath} at ${realPath(sourcePath)}`);
                        break;
                    }
                }
            }
            if (sourceText == null) {
                return callback(Error("Import file '" + sourcePath + ".ts' not found."));
            }
            stats.parseCount++;
            stats.parseTime += measure(() => {
                assemblyscript.parseFile(sourceText, sourcePath, false, parser);
            });
        }
        if (checkDiagnostics(parser, stderr)) {
            return callback(Error("Parse error"));
        }
    }

    // Include entry files
    for (let i = 0, k = argv.length; i < k; ++i) {
        const filename = argv[i];

        let sourcePath = String(filename).replace(/\\/g, "/").replace(/(\.ts|\/)$/, "");

        // Try entryPath.ts, then entryPath/index.ts
        let sourceText = readFile(sourcePath + ".ts", baseDir);
        if (sourceText === null) {
            sourceText = readFile(sourcePath + "/index.ts", baseDir);
            if (sourceText === null) {
                return callback(Error("Entry file '" + sourcePath + ".ts' not found."));
            } else {
                sourcePath += "/index.ts";
            }
        } else {
            sourcePath += ".ts";
        }

        stats.parseCount++;
        stats.parseTime += measure(() => {
            parser = assemblyscript.parseFile(sourceText, sourcePath, true, parser);
        });
        let code = parseBacklog();
        if (code) return code;
    }

    applyTransform("afterParse", parser);
    {
        let code = parseBacklog();
        if (code) return code;
    }

    // Finish parsing
    const program = assemblyscript.finishParsing(parser);

    // Set up optimization levels
    var optimizeLevel = 0;
    var shrinkLevel = 0;
    if (args.optimize) {
        optimizeLevel = defaultOptimizeLevel;
        shrinkLevel = defaultShrinkLevel;
    }
    if (typeof args.optimizeLevel === "number") {
        optimizeLevel = args.optimizeLevel;
    }
    if (typeof args.shrinkLevel === "number") {
        shrinkLevel = args.shrinkLevel;
    }
    optimizeLevel = Math.min(Math.max(optimizeLevel, 0), 3);
    shrinkLevel = Math.min(Math.max(shrinkLevel, 0), 2);

    // Begin compilation
    const compilerOptions = assemblyscript.createOptions();
    assemblyscript.setTarget(compilerOptions, 0);
    assemblyscript.setNoAssert(compilerOptions, args.noAssert);
    assemblyscript.setImportMemory(compilerOptions, args.importMemory);
    assemblyscript.setSharedMemory(compilerOptions, args.sharedMemory);
    assemblyscript.setImportTable(compilerOptions, args.importTable);
    assemblyscript.setMemoryBase(compilerOptions, args.memoryBase as number >>> 0);
    assemblyscript.setSourceMap(compilerOptions, args.sourceMap != null);
    assemblyscript.setOptimizeLevelHints(compilerOptions, optimizeLevel, shrinkLevel);

    if (!args.noLib) {
        // Initialize default aliases
        assemblyscript.setGlobalAlias(compilerOptions, "Math", "NativeMath");
        assemblyscript.setGlobalAlias(compilerOptions, "Mathf", "NativeMathf");
        assemblyscript.setGlobalAlias(compilerOptions, "abort", "~lib/env/abort");
        assemblyscript.setGlobalAlias(compilerOptions, "trace", "~lib/env/trace");
    }

    // Add or override aliases if specified
    if (args.use) {
        let aliases = args.use as string[];
        for (let i = 0, k = aliases.length; i < k; ++i) {
            let part = aliases[i];
            let p = part.indexOf("=");
            if (p < 0) return callback(Error("Global alias '" + part + "' is invalid."));
            let name = part.substring(0, p).trim();
            let alias = part.substring(p + 1).trim();
            if (!name.length) return callback(Error("Global alias '" + part + "' is invalid."));
            assemblyscript.setGlobalAlias(compilerOptions, name, alias);
        }
    }

    // Enable additional features if specified
    var features = args.enable as string | string[];
    if (features != null) {
        if (typeof features === "string") features = features.split(",");
        for (let i = 0, k = features.length; i < k; ++i) {
            let name = features[i].trim();
            let flag = assemblyscript["FEATURE_" + name.replace(/\-/g, "_").toUpperCase()];
            if (!flag) return callback(Error("Feature '" + name + "' is unknown."));
            assemblyscript.enableFeature(compilerOptions, flag);
        }
    }

    var module;
    stats.compileCount++;
    (() => {
        try {
            stats.compileTime += measure(() => {
                module = assemblyscript.compileProgram(program, compilerOptions);
            });
        } catch (e) {
            return callback(e);
        }
    })();
    if (checkDiagnostics(parser, stderr)) {
        if (module) module.dispose();
        return callback(Error("Compile error"));
    }

    // Validate the module if requested
    if (args.validate) {
        stats.validateCount++;
        stats.validateTime += measure(() => {
            if (!module.validate()) {
                module.dispose();
                return callback(Error("Validate error"));
            }
        });
    }

    // Set Binaryen-specific options
    if (args.trapMode === "clamp") {
        stats.optimizeCount++;
        stats.optimizeTime += measure(() => {
            module.runPasses(["trap-mode-clamp"]);
        });
    } else if (args.trapMode === "js") {
        stats.optimizeCount++;
        stats.optimizeTime += measure(() => {
            module.runPasses(["trap-mode-js"]);
        });
    } else if (args.trapMode !== "allow") {
        module.dispose();
        return callback(Error("Unsupported trap mode"));
    }

    // Implicitly run costly non-LLVM optimizations on -O3 or -Oz
    // see: https://github.com/WebAssembly/binaryen/pull/1596
    if (optimizeLevel >= 3 || shrinkLevel >= 2) optimizeLevel = 4;

    module.setOptimizeLevel(optimizeLevel);
    module.setShrinkLevel(shrinkLevel);
    module.setDebugInfo(args.debug);

    var runPasses = [];
    if (args.runPasses) {
        if (typeof args.runPasses === "string") {
            args.runPasses = args.runPasses.split(",");
        }
        args.runPasses = args.runPasses as string[];
        if (args.runPasses.length) {
            args.runPasses.forEach(pass => {
                if (runPasses.indexOf(pass) < 0)
                    runPasses.push(pass);
            });
        }
    }

    // Optimize the module if requested
    if (optimizeLevel > 0 || shrinkLevel > 0) {
        stats.optimizeCount++;
        stats.optimizeTime += measure(() => {
            module.optimize();
        });
    }

    // Run additional passes if requested
    if (runPasses.length) {
        stats.optimizeCount++;
        stats.optimizeTime += measure(() => {
            module.runPasses(runPasses.map(pass => pass.trim()));
        });
    }

    // Prepare output
    if (!args.noEmit) {
        let hasStdout = false;
        let hasOutput = false;

        if (args.outFile != null) {
            if (/\.was?t$/.test(args.outFile as string) && args.textFile == null) {
                args.textFile = args.outFile;
            } else if (/\.js$/.test(args.outFile as string) && args.asmjsFile == null) {
                args.asmjsFile = args.outFile;
            } else if (args.binaryFile == null) {
                args.binaryFile = args.outFile;
            }
        }

        // Write binary
        if (args.binaryFile != null) {
            let sourceMapURL = args.sourceMap != null
                ? (args.sourceMap as string[]).length
                    ? args.sourceMap
                    : path.basename(args.binaryFile as string) + ".map"
                : null;

            let wasm;
            stats.emitCount++;
            stats.emitTime += measure(() => {
                wasm = module.toBinary(sourceMapURL)
            });

            if ((args.binaryFile as string).length) {
                writeFile(args.binaryFile, wasm.output, baseDir);
            } else {
                writeStdout(wasm.output);
                hasStdout = true;
            }
            hasOutput = true;

            // Post-process source map
            if (wasm.sourceMap != null) {
                if ((args.binaryFile as string).length) {
                    let sourceMap = JSON.parse(wasm.sourceMap);
                    sourceMap.sourceRoot = sourceMapRoot;
                    sourceMap.sources.forEach((name, index) => {
                        let text = null;
                        if (name.startsWith(libraryPrefix)) {
                            let stdName = name.substring(libraryPrefix.length).replace(/\.ts$/, "");
                            if (libraryFiles.hasOwnProperty(stdName)) {
                                text = libraryFiles[stdName];
                            } else {
                                for (let i = 0, k = customLibDirs.length; i < k; ++i) {
                                    text = readFile(name.substring(libraryPrefix.length), customLibDirs[i]);
                                    if (text !== null) break;
                                }
                            }
                        } else {
                            text = readFile(name, baseDir);
                        }
                        if (text === null) {
                            return callback(Error("Source file '" + name + "' not found."));
                        }
                        if (!sourceMap.sourceContents) sourceMap.sourceContents = [];
                        sourceMap.sourceContents[index] = text;
                    });
                    writeFile(path.join(
                        path.dirname(args.binaryFile as string),
                        path.basename(sourceMapURL as string)
                    ).replace(/^\.\//, ""), JSON.stringify(sourceMap), baseDir);
                } else {
                    stderr.write("Skipped source map (stdout already occupied)" + EOL);
                }
            }
        }

        // Write asm.js
        if (args.asmjsFile != null) {
            let asm;
            if ((args.asmjsFile as string).length) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    asm = module.toAsmjs();
                });
                writeFile(args.asmjsFile, asm, baseDir);
            } else if (!hasStdout) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    asm = module.toAsmjs();
                });
                writeStdout(asm);
                hasStdout = true;
            }
            hasOutput = true;
        }

        // Write WebIDL
        if (args.idlFile != null) {
            let idl;
            if ((args.idlFile as string).length) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    idl = assemblyscript.buildIDL(program);
                });
                writeFile(args.idlFile, idl, baseDir);
            } else if (!hasStdout) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    idl = assemblyscript.buildIDL(program);
                });
                writeStdout(idl);
                hasStdout = true;
            }
            hasOutput = true;
        }

        // Write TypeScript definition
        if (args.tsdFile != null) {
            let tsd;
            if ((args.tsdFile as string).length) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    tsd = assemblyscript.buildTSD(program);
                });
                writeFile(args.tsdFile, tsd, baseDir);
            } else if (!hasStdout) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    tsd = assemblyscript.buildTSD(program);
                });
                writeStdout(tsd);
                hasStdout = true;
            }
            hasOutput = true;
        }

        // Write text (must be last)
        if (args.textFile != null || !hasOutput) {
            let wat;
            if (args.textFile && (args.textFile as string).length) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    wat = module.toText();
                });
                writeFile(args.textFile, wat, baseDir);
            } else if (!hasStdout) {
                stats.emitCount++;
                stats.emitTime += measure(() => {
                    wat = module.toText()
                });
                writeStdout(wat);
            }
        }
    }

    module.dispose();
    if (args.measure) {
        printStats(stats, stderr);
    }
    return callback(null);

    function readFileNode(filename, baseDir) {
        let dir = baseDir || "/"
        let name = path.resolve(path.join(dir, filename));
        try {
            let text;
            stats.readCount++;
            stats.readTime += measure(() => {
                text = fs.readFileSync(name, { encoding: "utf8" });
            });
            return text;
        } catch (e) {
            return null;
        }
    }

    function writeFileNode(filename, contents, baseDir) {
        try {
            stats.writeCount++;
            stats.writeTime += measure(() => {
                mkdirp(path.join(baseDir, path.dirname(filename)));
                if (typeof contents === "string") {
                    fs.writeFileSync(path.join(baseDir, filename), contents, { encoding: "utf8" });
                } else {
                    fs.writeFileSync(path.join(baseDir, filename), contents);
                }
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    function listFilesNode(dirname, baseDir) {
        var files;
        try {
            stats.readTime += measure(() => {
                files = fs.readdirSync(path.join(baseDir, dirname)).filter(file => /^(?!.*\.d\.ts$).*\.ts$/.test(file));
            });
            return files;
        } catch (e) {
            return [];
        }
    }
    let writeOutUsed = false;
    function writeStdout(contents) {
        if (!writeOutUsed) {
            stats.writeCount++;
            writeOutUsed = true;
        }
        stats.writeTime += measure(() => {
            if (typeof contents === "string") {
                stdout.write(contents, { encoding: "utf8" });
            } else {
                stdout.write(contents);
            }
        });
    }
}

/** Checks diagnostics emitted so far for errors. */
export function checkDiagnostics(emitter, stderr) {
    var diagnostic;
    var hasErrors = false;
    while ((diagnostic = assemblyscript.nextDiagnostic(emitter)) != null) {
        if (stderr) {
            stderr.write(
                assemblyscript.formatDiagnostic(diagnostic, stderr.isTTY, true) +
                EOL + EOL
            );
        }
        if (assemblyscript.isError(diagnostic)) hasErrors = true;
    }
    return hasErrors;
}


/** Creates an empty set of stats. */
export function createStats() {
    return {
        readTime: 0,
        readCount: 0,
        writeTime: 0,
        writeCount: 0,
        parseTime: 0,
        parseCount: 0,
        compileTime: 0,
        compileCount: 0,
        emitTime: 0,
        emitCount: 0,
        validateTime: 0,
        validateCount: 0,
        optimizeTime: 0,
        optimizeCount: 0
    };
}


if (!process.hrtime) process.hrtime = require("browser-process-hrtime");

/** Measures the execution time of the specified function.  */
export function measure(fn) {
    const start = process.hrtime();
    fn();
    const times = process.hrtime(start);
    return times[0] * 1e9 + times[1];
}


/** Formats a high resolution time to a human readable string. */
export function formatTime(time) {
    return time ? (time / 1e6).toFixed(3) + " ms" : "N/A";
}


/** Formats and prints out the contents of a set of stats. */
export function printStats(stats, output) {
    function format(time, count) {
        return formatTime(time);
    }
    (output || process.stdout).write([
        "I/O Read  : " + format(stats.readTime, stats.readCount),
        "I/O Write : " + format(stats.writeTime, stats.writeCount),
        "Parse     : " + format(stats.parseTime, stats.parseCount),
        "Compile   : " + format(stats.compileTime, stats.compileCount),
        "Emit      : " + format(stats.emitTime, stats.emitCount),
        "Validate  : " + format(stats.validateTime, stats.validateCount),
        "Optimize  : " + format(stats.optimizeTime, stats.optimizeCount)
    ].join(EOL) + EOL);
}


var allocBuffer = typeof global !== "undefined" && global.Buffer
    ? global.Buffer.allocUnsafe || function (len) { return new global.Buffer(len); }
    : function (len) { return new Uint8Array(len) };


export class MemoryStream {
    stream: Buffer[] = [];

    constructor(private fn?: (any) => void) { }

    write(chunk): void {
        if (this.fn) this.fn(chunk);
        if (typeof chunk === "string") {
            let buffer = allocBuffer(utf8.length(chunk));
            utf8.write(chunk, buffer, 0);
            chunk = buffer;
        }
        this.stream.push(chunk);
    }
    reset(): void {
        this.stream.length = 0;
    }
    toBuffer(): Buffer | Uint8Array {
        var offset = 0, i = 0, k = this.stream.length;
        while (i < k) offset += this[i++].length;
        var buffer: Buffer | Uint8Array = allocBuffer(offset);
        offset = i = 0;
        while (i < k) {
            buffer.set(this[i], offset);
            offset += this[i].length;
            ++i;
        }
        return buffer;
    };

    toString(): string {
        var buffer = this.toBuffer();
        return utf8.read(buffer, 0, buffer.length);
    };

}
/** Creates a memory stream that can be used in place of stdout/stderr. */
export function createMemoryStream(fn?) {

    return new MemoryStream(fn);
}


/** Compatible TypeScript compiler options for syntax highlighting etc. */
export const tscOptions = {
    alwaysStrict: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noEmitOnError: true,
    strictNullChecks: true,
    experimentalDecorators: true,
    target: "esnext",
    module: "commonjs",
    noLib: true,
    types: [],
    allowJs: false
};
