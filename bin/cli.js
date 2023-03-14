#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const chalk = require('chalk')
const figlet = require('figlet')
// 配置create命令
program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite a target directory if is exist')
  .action((name, options) => {
    // 传递name options给create 执行创建任务
    require('../lib/create')(name, options)
    // console.log('name:',name, 'options:', options)
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })

// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

  

program.on('--help', () => {
  // figlet ：打印奇怪的代码图形
  console.log('\r\n' + figlet.textSync('z-cli', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));

  // 监听help执行
  // 新增说明信息
  console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
})

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv)