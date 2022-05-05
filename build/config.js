const { name } = require('../package.json')

const testBranch = `test-${name}`

// 当前项目的打包名
exports.packageName = name

// 定义不同环境所使用的分支名称
const targetEnvironment = {
  staging: 'staging',
}
targetEnvironment[testBranch] = testBranch

exports.targetEnvironment = targetEnvironment
