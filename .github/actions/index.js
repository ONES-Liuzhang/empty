const core = require("@actions/core");
const artifact = require("@actions/artifact");
const { readFileSync } = require("../../utils");
const artifactClient = artifact.create();

/**
 * 1.根据名字创建一个 artifact
 * 2.
 */
function run() {
  const inputs = {
    sprint: core.getInput("sprint"),
    branch: core.getInput("branch"),
  };

  const artifactName = `${inputs.sprint}$$${inputs.branch}`;
  // download
  artifactClient.downloadArtifact(artifactName, "./artifact_tmp.json");
  const jsonStr = readFileSync("./artifact_tmp.json");
  if (jsonStr) {
    console.log(jsonStr);
  }

  // upload
  artifactClient.uploadArtifact(artifactName, "./tmp.json");

  process.on("uncaughtException", (error) => {
    core.setFailed(`运行失败！全局拦截错误：`, error);
  });

  process.on("exit", (code) => {
    console.log("process exit with errCode ", code);
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
    process.exit(1);
  } else {
    process.exit(2);
  }
}

run();
