const core = require("@actions/core");

function getInputs() {
  const sprint = core.getInput(Inputs.Sprint);
  const branch = core.getInput(Inputs.Branch);

  /** Optional */
  const username = core.getInput(Inputs.UserName);
  const password = core.getInput(Inputs.Password);
  const teamName = core.getInput(Inputs.TramName);
  const warn = core.getInput(Inputs.warn);

  return {
    sprint,
    branch,
    username,
    password,
    teamName,
    warn,
  };
}

function run() {
  const inputs = getInputs();

  console.log(JSON.stringify(inputs));

  if (inputs.warn) {
    core.setFailed("失败!");
  }
}

run();
