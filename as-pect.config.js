module.exports = {
  /**
   * A set of globs passed to the glob package that qualify typescript files for testing.
   */
  include: [
    "packages/*/assembly/__tests__/**/*.spec.ts"
  ],
  /**
   * A set of globs passed to the glob package that quality files to be added to each test.
   */
  add: ["packages/assemblyscript/assembly/__tests__/wasa.include.ts"],
  /**
   * All the compiler flags needed for this test suite. Make sure that a binary file is output.
   */
  flags: {
    "--validate": [],
    "--debug": [],
    /** This is required. Do not change this. */
    "--binaryFile": ["output.wasm"]
  },
  /**
   * A set of regexp that will disclude source files from testing.
   */
  disclude: [/packages\/.*node_module/i],
  /**
   * Add your required AssemblyScript imports here.
   */
  imports: {}
  /**
   * Add a custom reporter here if you want one
   */
  // reporter: new CustomReporter(),
};
