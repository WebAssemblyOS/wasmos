import { main as pwd } from "../bin/pwd";
import { stdout, stderr } from './fixtures';


describe("pwd", (): void => {

  beforeEach((): void => {
    stdout.reset()
    Console.stdout.erase() //Erases and resets
    stderr.reset();
    Console.stderr.erase() //Erases and resets
    CommandLine.reset();
  });

  it("should give the root path", (): void => {
    CommandLine.push("pwd")
    pwd(CommandLine.all());
    let rootStr = "/\n"
    expect<string>(stdout.readString().result).toBe(rootStr)

  })

  it("switch directory", (): void => {
    //Creates directory test and switches into it
    let res = fs.createDirectory("/testdir") // /test is alread a file see ./simple_fs.ts
    expect<bool>(res.failed).toBe(false);
    let dirfd = res.result.fd
    fs.cwd = dirfd
    CommandLine.push("pwd")
    pwd(CommandLine.all());
    let testDir = "/testdir\n"
    expect<string>(stdout.readString().result).toBe(testDir)
  })
})