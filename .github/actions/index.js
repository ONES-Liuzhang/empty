const core = require("@actions/core");
const child_process = require("child_process");

function run() {
  const subProcess = child_process.exec("node ./custom.js", {
    stdio: "inherit",
  });

  subProcess.on("uncaughtException", (error) => {
    core.setFailed(`运行失败！全局拦截错误：`, error);
  });

  subProcess.on("exit", (code) => {
    if (code === 1) {
      core.setFailed(`失败`);
    } else {
      core.info(`成功`);
    }
  });
}

run();
