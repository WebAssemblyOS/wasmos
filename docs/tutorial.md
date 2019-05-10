
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

Now that you are caught up, you need to make a new branch for what task you are working on. If you haven't already pick one from [here](https://github.com/WebAssemblyOS/wasmos/issues/19) to work on and make an issue [here](https://github.com/WebAssemblyOS/wasmos/issues).
For example,

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

After filling out the file, add it again, commit, and push it.  Then you can open a pull request to merge with `wasmos/ash` branch. Make sure that in your pull request you include `fixes #issueNumber`, a handy drop down will help you find the right one after you type `#`.

Then open another issue to write tests for echo.  Checkout `packages/ash/assembly/__tests__/echo.spec.ts` as a place to start. To test your AssemblyScript run `npx asp`

## Other things to know

To access the file system there is a global that your file named `fs`, however, it is important that you include this in your tests, which defines it as the mock.  This shouldn't be an issue if you copied `echo.spec.ts`.

`fs.open(path: string): fd` this returns a file descriptor, which is a 32 bit unsigned integer.  It is the identifer a FileDescriptor class, which you can access by using `fs.get(fd: fd): FileDescriptor`.  However, this is only for the mock so the "proper" api to pass it when reading or writing to the file.

e.g.
```ts
fs.writeString(fd: fd, str: string): void
```
A FileDescriptor is a new reference to the file and an offset.  This means if you can have two FileDescriptor's open for the same file.  Then each time you read or write to the file you move the offset or "seek".
