// @utils/debugger.ts
export const Debug = {
  log(scope: string, msg: string, data?: any) {
    // color cyan
    console.log(`\x1b[36m[${scope}]\x1b[0m ${msg}`);
    if (data !== undefined) console.log("   →", data);
  },
  warn(scope: string, msg: string, data?: any) {
    // color yellow
    console.warn(`\x1b[33m[${scope} WARN]\x1b[0m ${msg}`);
    if (data !== undefined) console.warn("   →", data);
  },
  error(scope: string, msg: string, err?: any) {
    // color red
    console.error(`\x1b[31m[${scope} ERROR]\x1b[0m ${msg}`);
    if (err) {
      if (err instanceof Error) console.error("   ↳", err.message);
      else console.error("   ↳", err);
    }
  },
};
