
import * as asc from "assemblyscript/dist/asc";
import * as loader from "assemblyscript/lib/loader/lib";
import * as vue from 'vue-compiler';
import * as BrowserFS from "browserfs";
import { promisfy } from "../util";
import { Actor } from "./actor"

// import tsc from "typescript";
// import {initWorker}  from "../fs";

export class worker {
  static get isMainThread(): boolean {
    try{
      return (this instanceof DedicatedWorkerGlobalScope);
    }catch(error){
      return false;
    }
  }
}

let ctx: Worker = <any> self;
import * as fs from "fs";


async function start(){
  // await initWorker();
  (<any> ctx).fs = BrowserFS.BFSRequire("fs");
  let fs = (<any>ctx).fs;
  console.log(await promisfy(fs.readdir)("."));
  postMessage({event:await promisfy(fs.readdir)(".")});
}
start();

async function readFile(path: string, basename?: string) {
  return  promisfy(fs.readFile)(path).toString();
}

async function writeFile(path: string, data: any){
  promisfy(fs.writeFile)(path, data)
}

async function compile(path: string) {
  let source = {};
  source[path] = "";

  return await (<any>asc.compileString)(source, {readFile, writeFile});
}

onmessage = async (mesg: MessageEvent) => {
  if (mesg.data.path){
    postMessage({result: await readFile(mesg.data.path)})
  }
}
