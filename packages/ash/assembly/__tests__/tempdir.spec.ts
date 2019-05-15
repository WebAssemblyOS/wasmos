
import { stdout, Hello, World, readString, Hello_World } from './fixtures';
import { main as tempdir } from "../bin/tempdir";

const testtext1 = "This is some testing text.";

describe("tempdir", (): void => {

  beforeEach((): void => {
    stdout.reset();
    Console.stdout.erase();
    CommandLine.reset();
    CommandLine.push("tempdir");
  })

  it("should print the tempdir", (): void => {
    tempdir(CommandLine.all());
    let stdoutStr = readString(stdout);
    // log<string>("stdout: " + stdoutStr);
    expect<string>(stdoutStr).toBe("/tmp");
  });

  it("should create a file inside tempdir", (): void => {
    tempdir(CommandLine.all());
    let tempDirOutput = readString(stdout);
    expect<string>(tempDirOutput).toBe("/tmp");

    let openTmpDir = fs.openDirectory(tempDirOutput);
    expect<bool>(openTmpDir.failed).toBeFalsy();
    let tmpDirFd = openTmpDir.result.fd;
    let filePath = tempDirOutput + "/testfile456";
    let createFileAtTmpDir = fs.createFileAt(tmpDirFd, filePath);
    expect<bool>(createFileAtTmpDir.failed).toBeFalsy();
  });

  it("should be able to write to a file created inside tempdir", (): void => {
    tempdir(CommandLine.all());
    let tempDirOutput = readString(stdout);
    expect<string>(tempDirOutput).toBe("/tmp");

    let openTmpDir = fs.openDirectory(tempDirOutput);
    expect<bool>(openTmpDir.failed).toBeFalsy();
    let tmpDirFd = openTmpDir.result.fd;
    let filePath = tempDirOutput + "/testfile456";
    let createFileAtTmpDir = fs.createFileAt(tmpDirFd, filePath);
    expect<bool>(createFileAtTmpDir.failed).toBeFalsy();

    let tmpDirFileFd = createFileAtTmpDir.result.fd;
    let writeToFile = fs.writeString(tmpDirFileFd, testtext1);

    let openTextFile = fs.openForRead(filePath);
    expect<bool>(openTextFile.failed).toBeFalsy("test file should be able to be read");
    let readTextFile = openTextFile.result.readString();
    expect<bool>(readTextFile.failed).toBeFalsy();
    let fileText = readTextFile.result;
    expect<string>(fileText).toBe(testtext1);
  });

})
