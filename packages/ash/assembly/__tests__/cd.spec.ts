
import { stdout, Hello, World, readString } from './fixtures';
import { main as cd } from "../bin/cd";

describe("cd", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("cd");
  })

  it("home directory when no arguemnts", (): void => {

  });

  it("go to correct directory", (): void => {

  });


})
