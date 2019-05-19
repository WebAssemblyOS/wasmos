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
    CommandLine.push('');
    cd(CommandLine.all());
    let dir = fs.openDirectory('');
    expect<bool>(dir.failed).toStrictEqual(false);
  });

  it("go to nonexisting directory", (): void => {
    CommandLine.push("changeDir/");
    cd(CommandLine.all());
    let dir = fs.openDirectory("changeDir/");
    expect<bool>(dir.failed).toStrictEqual(true);
  });

  it("go to existing directory", (): void => {
   CommandLine.push("/dev");
   cd(CommandLine.all());
   let dir = fs.openDirectory('/dev');
   expect<bool>(dir.failed).toStrictEqual(false);
  });

})
