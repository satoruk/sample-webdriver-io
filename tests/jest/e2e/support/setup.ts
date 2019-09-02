import * as selenium from "./selenium";

export default async function setup() { 
  console.log(`SETUP PID:${process.pid} PPID:${process.ppid}`);
  await selenium.setup();
}