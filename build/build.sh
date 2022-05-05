#!/usr/bin/env node
const inquirer = require('inquirer')
const { execSync, spawn } = require('child_process')

// 获取打包的环境配置
const { packageName, targetEnvironment } = require('./config')

const currentBranch = execSync('git symbolic-ref --short -q HEAD').toString().trim()
const allBranches = getBranches()
const promptList = [
  {
    choices: allBranches,
    default: allBranches.indexOf(currentBranch),
    message: 'Please specify which branch you want to build:',
    name: 'source',
    type: 'list'
  },
  {
    choices: Object.keys(targetEnvironment),
    name: 'target',
    message: 'Please select a target environment:',
    type: 'list'
  }, {
    default: false,
    message: function (answers) {
      return 'Please \033[31mMAKE SURE\033[0m your branch (\033[32m' + answers.source + '\033[0m) is up to date and your workspace is clean!\n  \033[31mAre you sure to continue?\033[0m'
    },
    name: 'confirm',
    type: 'confirm'
  }]

function getBranches (stdout) {
  try {
    const tagetBranches = Object.values(targetEnvironment)
    const result = execSync('git branch').toString().trim()

    const branches = []
    result.split('\n').forEach((item, index) => {
      const branchName = item.trim().replace('* ', '') // 去除当前分支名前的 * 号

      if (!tagetBranches.includes(branchName)) {
        branches.push(branchName)
      }
    })
    return branches
  } catch (err) {
    console.log('error =', err)
    return []
  }
}

function build (answers) {
  const child = spawn('sh', ['build/sub-build.sh'], {
    stdio: 'inherit',
    env: Object.assign({
      SOURCE_BRANCH: answers.source,
      TARGET_BRANCH: targetEnvironment[answers.target],
      PACKAGE_NAME: packageName
    }, process.env)
  })

  child.on('close', (code) => {
    // console.log(`exit：${code}`)

    execSync('git checkout ' + currentBranch)
  })
}

async function main () {
  let answers = await inquirer.prompt(promptList)
  // console.log(answers) // 返回的结果

  if (answers.confirm) {
    build(answers)
  }
}

main()
