import { main as mkdir } from "../bin/mkdir";


describe("mkdir", (): void => {

    beforeEach((): void => {
        Console.stderr.erase()
        Console.stderr.erase()
        CommandLine.reset();
        CommandLine.push("mkdir");
    })

    it("simple top level direcotry has no error", (): void => {
        CommandLine.push("/test")
        mkdir(CommandLine.all())
        expect<u32>(Console.stderr.offset).toBe(0);
    })

    it("if the parent directory does not exists it should be failed", (): void => {
        CommandLine.push("/foo/test")
        mkdir(CommandLine.all())
        expect<u32>(Console.stderr.offset).toBeGreaterThan(0);
    })

    it("if the parent directory dones not exists but it has '-p'", (): void => {
        CommandLine.push("-p")
        CommandLine.push("/foo/test")
        mkdir(CommandLine.all())
        expect<u32>(Console.stderr.offset).toBe(0);
        let result = fs.openDirectory("/foo/test")
        expect<bool>(result.failed).toBe(false)
    })
})
