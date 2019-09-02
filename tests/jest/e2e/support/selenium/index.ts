import * as selenium  from "selenium-standalone";
import * as  util from "util";

import { ChildProcess, InstallOpts, StartOpts } from "selenium-standalone";

let terminator: Promise<void> = Promise.resolve();
let seleniumProcess: selenium.ChildProcess;

export async function setup() { 
  console.log(`SETUP SELENIUM PID:${process.pid} PPID:${process.ppid}`);
  const seleniumInstall = util.promisify<InstallOpts>(selenium.install);
  const seleniumStart = util.promisify<StartOpts, ChildProcess>(selenium.start);

  await seleniumInstall({
    // version: "2.47.0",
    drivers: {
      chrome: {
        // version: "76.0.3809.132",
        arch: process.arch,
        baseURL: "https://chromedriver.storage.googleapis.com"
      },
    },
    requestOpts: { // see https://github.com/request/request#requestoptions-callback
      timeout: 10000
    }
  });

  // 何かしらの問題でポートが使われてることがあるので以下のコマンドで確認できる.
  // > lsof -n -P -i :4444
  // 使われてた時の警告は未対応
  seleniumProcess = await seleniumStart({
    spawnOptions: {
      stdio: 'inherit'
    },
    // seleniumArgs:["-port", "4445"],
    drivers: {
      chrome: {
        // check for more recent versions of chrome driver here:
        // https://chromedriver.storage.googleapis.com/index.html
        // version: '2.33',
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      },
      // browser: "chrome",
      // version: '2.39',
      // arch: process.arch,
      // baseURL: "https://chromedriver.storage.googleapis.com"
    }
  }).catch((error) => { 
    console.log('UUUUUUUUUUUUUUUUUUUUUUUUUU');
    console.log({
      name: error.name,
      message: error.message
    });
    throw error;
    // process.abort();
  });

  terminator = new Promise<void>((resolve) => { 
    // シグナルを受け取って終了
    seleniumProcess.on("exit", (code, signal) => {
      console.log(`SELENIUM EXIT(${signal}): ${code}`);
      resolve();
    })
  })
}

export async function teardown() { 
  console.log(`TEARDOWN SELENIUM PID:${process.pid} PPID:${process.ppid}`);

  seleniumProcess.kill(); // SIGTERM
  // 終了を確実に待たせる.
  await terminator;
}