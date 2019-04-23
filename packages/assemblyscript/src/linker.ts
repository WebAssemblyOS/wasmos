import * as path from "path";
import { glob, fs, mkdirp, assemblyFolders } from "@wasmos/fs/src/index";

export async function linkLibrary(rootPath: string): Promise<string> {
  let folders = await assemblyFolders(rootPath);
  let assemblyFolder = path.join(rootPath, "node_modules", ".assembly");
  await mkdirp(assemblyFolder);
  let pwd = process.cwd();
  process.chdir(assemblyFolder);
  await Promise.all(
    folders.map(async (v: string) => {
      let folder = path.dirname(v);
      let grandFolder = path.dirname(folder);
      folder = path.basename(folder);
      while (path.basename(grandFolder) != "node_modules") {
        folder = path.join(path.basename(grandFolder), folder);
        grandFolder = path.dirname(grandFolder);
      }
      if (path.basename(path.dirname(folder)) != "node_modules") {
        await mkdirp(path.dirname(folder));
      }
      let folderExists = await fs.pathExists(folder);
      if (!folderExists) {
        let realPath = await fs.realpath(v);
        await fs.symlink(realPath, folder, "dir");
      }
    })
  );
  process.chdir(pwd);

  return assemblyFolder;
}
