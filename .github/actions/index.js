const core = require("@actions/core");
const artifact = require("@actions/artifact");
const { readFileSync, writeFileSync } = require("../../utils");
const artifactClient = artifact.create();

function getCookie() {
  return ["2333"];
}

/**
 * 1.根据名字创建一个 artifact
 * 2.
 */
async function run() {
  const inputs = {
    sprint: core.getInput("sprint"),
    branch: core.getInput("branch"),
  };

  const artifactName = `${inputs.sprint}$$${inputs.branch}`;
  // 尝试下载 cookie download
  try {
    const downloadResponse = await artifactClient.downloadArtifact(artifactName);

    console.log(downloadResponse);
    // const jsonStr = await readFileSync("./artifact_tmp.json");
    console.log(`成功下载 artifact: ${artifactName}，文件位置：`, downloadResponse.artifactName);
  } catch (err) {
    console.error("下载失败", err);
  }

  try {
    // 获取新的 cookie，保存到临时文件
    const cookie = getCookie();
    const cookieStr = JSON.stringify(cookie);
    await writeFileSync("./tmp.json", cookieStr);
  } catch (err) {
    console.error("获取 cookie 失败", err);
  }

  try {
    // 上传文件
    await artifactClient.uploadArtifact(artifactName, ["./tmp.json"], ".");
  } catch (err) {
    console.error("上传失败", err);
  }

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
}

run();
