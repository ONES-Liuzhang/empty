const core = require("@actions/core");

function run() {
  process.on("uncaughtException", (error) => {
    core.setFailed(`运行失败！全局拦截错误：`, error);
  });

  process.on("exit", (code) => {
    console.log('process exit with errCode ', code)
    if (code === 2) {
      core.setFailed(`失败`);
    } else {
      core.info(`成功`);
    }
  });

  process.on("exit", (code) => {
    console.log("parent process exit with errorCode ", code);
  });
  
  if ((Math.random() * 100) & 1) {
    process.exit(1)
  } else {
    process.exit(2)
  }
}

run();
