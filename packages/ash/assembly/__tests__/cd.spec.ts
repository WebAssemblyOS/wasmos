
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
    CommandLine.push("/");
    cd(CommandLine.all());
    expect<bool>(fs.openDirectory('/').failed).toStrictEqual(false);
  });

  it("go to nonexisting directory", (): void => {
    //returns 1
    CommandLine.push("changeDir/");
    cd(CommandLine.all());
    expect<bool>(fs.openDirectory("changeDir/").failed).toStrictEqual(true);
  });

  it("go to existing directory", (): void => {
  
  //  CommandLine.push("/");
  //  cd(CommandLine.all());
  //  expect<bool>(fs.openDirectory('/').failed).toStrictEqual(false);
  });

})
