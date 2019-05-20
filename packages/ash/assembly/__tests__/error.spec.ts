import { stdout, Hello, World, readString, stderr } from './fixtures';
import { main as error } from "../bin/error";
import { main as cat } from "../bin/cat";
import { main as echo } from "../bin/echo";


describe("error", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();

  })

  it("cat should cause an error if the file doesn't exist", (): void => {
    CommandLine.push("cat");
    CommandLine.push("thisshouldn'twork");
    cat(CommandLine.all());

    let status = error();

    expect<i32>(status).toBe(1);




  });

  it("echo should not cause any error", (): void => {
    CommandLine.push("echo");
    CommandLine.push("test");
    echo(CommandLine.all());

    let status = error();

    expect<i32>(status).toBe(0);


  });

})
