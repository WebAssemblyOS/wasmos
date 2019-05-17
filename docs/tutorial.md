
# Getting started

After cloning your fork, you need to make sure that your fork's master is caught up with the main one.

## Adding remote branch

Recall that by default when you clone your fork, when you run the following:

```
git remote -v
```

You should see somethnig like:

```
origin	git@github.com:willemneal/wasmos (fetch)
origin	git@github.com:willemneal/wasmos (push)
```

To add the main repo as an upstream run:

```
git remote add upstream git@github.com:WebAssemblyOS/wasmos.git
```

Then you need to pull from it. From your master branch run:

```
git pull upstream master
```

If you get any errors you should either do a `git stash` and after pulling `git stash pop`, or `git reset --hard HEAD` to ensure that your local branch rolls back to the HEAD deleting all changes.  If you choose this path, **please** do `git status` first to make sure that there are no files that you do want to keep.  This is mainly if you have configuration files that would be overwritten by the update anyway.

If you have fastforwarded to the new HEAD from the main repo, you should do `git push` so that your `origin` repo catches up too.

## Making a new branch
For this tutorial, I'll be implementing `echo.ts`, which will be in the `packages/ash/assembly/bin`

Now that you are caught up, you need to make a new branch for what task you are working on. If you haven't already pick one from [here](https://github.com/WebAssemblyOS/wasmos/issues/19) to work on and make an issue [here](https://github.com/WebAssemblyOS/wasmos/issues) that references the first issue, e.g. "see #19" this will create a link in #19 that points to the new issue, this way you can look at #19 to see which ones have been taken.

Next:

```
git checkout -b dev-echo # this creates and switches to the new branch
```

then I create a `echo.ts` file.

Even if it's empty let's add it to git.

```
git add packages/ash/assembly/bin/echo.ts ## This will be different for you.
git commit -m "added empty file"
git push origin dev-echo ## Again this will be different for you
```


Next write tests for echo.  Copy `packages/ash/assembly/__tests__/echo.spec.ts` to a new file with the name of your program. 

Now go ahead and also commit and push this as well.

## Making a Pull Request
Once you have your initial commit to your development branch you can open a pull request, which starts the process of merging this branch with in this case `wasmos/ash`.  This doesn't mean that the branch has to completely ready for merge, just that you intend of merging it.  It also allows others, like me, to look at it and even colloborate with you on it.

To get started make sure your pushed your branch, then head over to your fork of the repo, "https://github.com/githubusername/wasmos" and you should see above the contents a green button that asks if you want to open a pull request with the new branch you made.  If this is not the case then just head over to the [main repo](https://github.com/WebAssemblyOS/wasmos) and click on Pull Requests above the contents (not the very top).

Next it will ask you which branch to merge with pick `wasmos/ash`.  Give it the name of your program and in the comment section include `fixes #YourIssueNumber`, a handy drop down will help you find the right one after you type `#`.  If there are any conflict errors it's okay to still create the pull request as once you make it I can help correct it.


## Running tests

To test your AssemblyScript run `npx asp -f "filename regex"`, e.g. `npx asp -f echo` would run just `echo.spec.ts` or any test with echo in the name.  If this doesn't work try running `npm clean-install`, which will make sure you're using the latest verson of the testing framework, `as-pect`.

You can use `as-pect`'s build in print function using `log<string>("hello world")`. It's very handy and can be used in your program.  If you need to print something other than a string you have to provide the type, e.g. `log<usize>(42)`.

## Other things to know

To access the file system there is a global named `fs`.

`fs.openFile(path: string): fd` this returns a `WasiResult<FileDescriptor>` , which either failed or contains the resulting file descriptor class.

```ts
let res = fs.openFile("/hello");
if (res.failed){
    Console.Error(result.error.toString()) //prints the error code
    return;
}
let file = res.result;  //Now have access to the FileDescriptor

```
A FileDescriptor is a reference to a file and an offset.  This means if you can have two FileDescriptor's open for the same file.  Then each time you read or write to the file you move the offset or "seek".
```ts
file.writeString("Hello World\n"); //Writes a line to the file, which moves the file offset

file.reset() // uses file.seek to move file offset to 0.
let line = file.readLine(); // Returns a WasiResult<string> as the read could have fail, e.g. at end of file.
let hello = line.result; //Access the string.
```

To see the complete interface look at [types/wasa/index.d.ts](https://github.com/WebAssemblyOS/wasmos/blob/master/types/wasa/index.d.ts).

Your test can import a premade file descriptor for stdout, stderr, and stdin is `packages/ash/assembly/__tests__/fixtures.ts`.  This is handy because when print to stdout using `Console.write` or `Console.log`, Console has it's own file descriptor which updates it's offset after each write, whereas `stdout` will still point to the beginning of the file.

