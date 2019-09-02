import * as selenium from "./selenium";

export default async function teardown() { 
  console.log(`TEARDOWN PID:${process.pid} PPID:${process.ppid}`);
  await selenium.teardown();
}