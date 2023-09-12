const path = require("path");
const fs = require("fs");
const os = require("os");
const DIR = path.join(os.tmpdir(), process.env.TMP_DIRNAME || "open_test_temp");
const mkdirp = require("mkdirp");

/**
 * 写文件 参数和 fs.writeFile 一致
 * @param {*} filePath
 * @param {*} data
 * @param {*} options
 * @returns
 */
function writeFileSync(filePath, data, options) {
  try {
    const dirname = path.dirname(filePath);
    mkdirp.sync(dirname);

    return fs.writeFileSync(filePath, data, options);
  } catch (err) {
    console.error("[UTILS] writeFileSync Error ", err);
    return false;
  }
}

function readFileSync(filePath, options) {
  try {
    return fs.readFileSync(filePath, options);
  } catch (err) {
    // 文件不存在
    if (err.code === "ENOENT") {
      return "";
    }
    console.error("[UTILS] readFileSync Error ", err);
  }
}

/**
 * 写入文件到临时文件夹，主要为 jest 不同的案例之间提供公共数据
 * @param {*} filename 文件名
 * @param {*} data 要写入的内容
 * @param {*} options
 */
function writeTmpFileSync(filename, data) {
  const absPath = path.join(DIR, filename);
  return writeFileSync(absPath, data, "utf8");
}

/**
 * 读取临时 json
 * @param {*} filename 文件名
 */
function loadTmpFileSync(filename) {
  const absPath = path.join(DIR, filename);
  return readFileSync(absPath, "utf8");
}

/**
 *
 * @returns 操作系统默认临时文件夹路径
 */
function getTmpDir() {
  return DIR;
}

/** 创建一个表示当前时间的符串 */
function createDateStr() {
  const date = new Date();
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("_");
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");

  reporterDir = `${day}_${time}`;
  return reporterDir;
}

const REPORTERS_FILENAME = "reporters.txt";
let reporterDir = "";
/**
 * 获取存放测试报告的 dir
 * 1. 如果 reporterDir 存在则直接返回，此时脚本在同一上下文中运行
 * 2. 如果没获取到，则判断临时文件中有没有，临时文件会在 jest 全部的脚本完之后才销毁，避免因为上下文不同导致获取的文件名不一致
 */
function _getReporterDir() {
  if (reporterDir) return reporterDir;

  reporterDir = loadTmpFileSync(REPORTERS_FILENAME);
  if (!reporterDir) {
    reporterDir = createDateStr();
    writeTmpFileSync(REPORTERS_FILENAME, reporterDir);
  }
  return reporterDir;
}

/**
 * 测试报告生成的文件夹位置
 * @param {*} prefix
 * @returns
 */
function getReporterDir(prefix = "reporters") {
  const dir = _getReporterDir();

  return `${prefix}/${dir}`;
}

function omit(arr, excludes) {
  if (!excludes) return arr;

  if (typeof excludes === "string") {
    excludes = [excludes];
  }

  const result = [];

  for (const item of arr) {
    if (!excludes.includes(item)) {
      result.push(item);
    }
  }

  return result;
}

function normalizeProjectName(name) {
  return name.split("-")[1];
}

function formatUrl(unsafeUrl) {
  const reg = /^(http[s]?:\/\/)(.*)/;
  // eslint-disable-next-line no-unused-vars
  const [_, domain, path] = reg.exec(unsafeUrl);

  return `${domain}${path.replaceAll("//", "/")}`;
}

module.exports = {
  writeFileSync,
  readFileSync,
  getReporterDir,
  normalizeProjectName,
  writeTmpFileSync,
  loadTmpFileSync,
  getTmpDir,
  formatUrl,
  omit,
};
