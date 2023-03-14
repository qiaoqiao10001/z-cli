const ora = require('ora')
const inquirer = require('inquirer')
const { getRepoList, getTagList } = require('./http')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const path = require('path')

class Generator {
  constructor(name, targetDir) {
    // 目录位置
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async download(repo, tag){
    const requestURL = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
    await wrapLoading(
      this.downloadGitRepo,
      'wait download template',
      requestURL,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己下载新的模板名称
  // 3）return 用户选择的名称

  async getRepo () {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
    if (!repoList) return;

    const repos = repoList.map(item => item.name);

    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a template'
    })
    return repo;
  }

  async getTag (repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map(item => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  async create () {
    // 创建逻辑
    const repo = await this.getRepo()
    const tag = await this.getTag(repo)
    await this.download(repo, tag)

    console.log('选择了repo=' + repo, ',tag=' + tag)
  }
}

async function wrapLoading (fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    // 执行传入方法
    const result = await fn(...args)
    spinner.succeed();
    return result
  } catch (err) {
    spinner.fail('request failed refetch ...')
  }
}
module.exports = Generator