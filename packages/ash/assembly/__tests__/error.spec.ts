import { stdout, readString } from './fixtures';
import { main as error } from "../bin/error";
import { main as cat } from "../bin/cat";


describe("error", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();

  })

  it("cat should cause an error if the file doesn't exist", (): void => {
    CommandLine.push("test");
    cat(CommandLine.all());

    let stdoutStr = readString(stdout)

    expect<string>(readString(Console.stdout)).toBe("The last command produced an error.")

  });

})
