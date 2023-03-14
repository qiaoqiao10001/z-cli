const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const Generator = require('./Generator')
// 执行创建目录
module.exports = async function (name, options) {
  console.log('>>> create.js name:', name, options)
  // 创建目录的时候，考虑目录是否存在？
  // 存在  -f true 直接覆盖  -f false 的时候 询问用户是否覆盖
  // 不存在： 直接创建
  // 当前目录
  const cwd = process.cwd()
  // 目标目录需要加上name的文件夹
  const targetDir = path.join(cwd, name)
  console.log(targetDir)
  if(fs.existsSync(targetDir)) {
    if(options.force) {
      // 直接覆盖
      await fs.remove(targetDir)
    }else {
      // todo: 询问用户是否确定覆盖

      let {action} = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwirte',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if(!action) {
        return;
      }else if(action === 'overwrite') {
        console.log(`\r\nRemoving`)
        await fs.remove(targetDir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetDir)
  generator.create()
}