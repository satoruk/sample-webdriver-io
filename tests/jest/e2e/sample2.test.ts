test("E2E sample2", () => { 
  console.log(`E2E sample2 PID:${process.pid} PPID:${process.ppid}`);
  expect(1 + 2).toBe(3);
});