import {
  Builder,
  By,
  Key,
  until,
  Logs,
  logging,
  Capabilities
} from "selenium-webdriver";
import * as process from "process";
import * as os from "os";
import WebpackDevServer from "webpack-dev-server";
import * as child from "child_process";

const sleep = (t: number) => new Promise(r => { setTimeout(r, t); });

var osKind = "mac"
if (os.type() !== "Darwin") {
  osKind = "linux"
}
// process.chdir(`${__dirname}/..`);
// // let _child = child.exec("npm run watch");
let path = process.env["PATH"];
process.env["PATH"] = `${__dirname}/../.browsers/${osKind}:${path}`;
var prefs = new logging.Preferences();
prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);

async function example(browser: string) {
  Capabilities.firefox().setLoggingPrefs(prefs)
  let driver = await new Builder()
              .forBrowser(browser)
              .build();
  try {
    // logging.addConsoleHandler(new logging.Logger("test"))
    await driver.get('http://localhost:8080');
    let logs = await driver.manage().logs().get(logging.Type.BROWSER);
    // console.log(logs);
    // console.log(await driver.getAllWindowHandles());

    console.log("YAY " + browser);
  } catch (e){
    console.log(e.stack);
  }finally {
    await driver.quit();
  }
}

// console.log(_child.toString())
//
example("firefox");
// example("chrome");
