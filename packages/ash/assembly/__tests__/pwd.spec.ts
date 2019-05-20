import { main as pwd } from "../bin/pwd";
import { stdout, stderr } from './fixtures';


describe("pwd", (): void => {

  beforeEach((): void => {
    stdout.reset()
    Console.stdout.erase() //Erases and resets
    stderr.reset();
    Console.stderr.erase() //Erases and resets
    CommandLine.reset();
    CommandLine.push("cat");
  });

  it("should give the root path", (): void => {
    CommandLine.push("pwd")
    pwd(CommandLine.all());
    let rootStr = "/\n"
    expect<string>(stdout.readString().result).toBe(rootStr)

  })

  it("switch directory", (): void => {
    //Creates directory test and switches into it
    let res = fs.createDirectory("test")
    let dirfd = res.result.fd
    fs.cwd = dirfd;
    CommandLine.push("pwd")
    pwd(CommandLine.all());
    let testDir = "/test\n"
    expect<string>(stdout.readString().result).toBe(testDir)
  })
})