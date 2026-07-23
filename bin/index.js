#!/usr/bin/env node

/**
 * create-axewo-micro
 * 企业级微前端脚手架 CLI (内置全自动安装与极佳交互逻辑)
 */

const path = require('path')
const { execSync, spawn } = require('child_process')
const fs = require('fs-extra')
const prompts = require('prompts')
const degit = require('degit')
const { green, cyan, yellow, red, bold } = require('kolorist')
const pkg = require('../package.json')

// ===== 帮助与版本号处理 =====
const args = process.argv.slice(2)
if (args.includes('-v') || args.includes('--version')) {
  console.log(`create-axewo-micro v${pkg.version}`)
  process.exit(0)
}

if (args.includes('-h') || args.includes('--help')) {
  console.log(`
${bold(cyan('create-axewo-micro'))} v${pkg.version}

${bold('使用方式:')}
  $ npx create-axewo-micro [项目名称]
  $ npm create axewo-micro [项目名称]

${bold('选项:')}
  -v, --version  查看脚手架版本号
  -h, --help     查看帮助信息
`)
  process.exit(0)
}

async function init() {
  console.log()
  console.log(bold(cyan('🚀 欢迎使用 Axewo 微前端平台 CLI 脚手架')))
  console.log()

  const defaultAppName = args[0] && !args[0].startsWith('-') ? args[0] : 'my-micro-app'

  // ===== 1. 第一阶段问答 =====
  const response = await prompts(
    [
      {
        type: 'select',
        name: 'templateType',
        message: '请选择您要初始化的工程类型:',
        choices: [
          {
            title: `${green('1) 业务子应用模板 (Sub-App Template)')} — 基于 Vue 3 + Vite + @axewo/micro-shared`,
            value: 'charsle/micro-sub-app-template',
          },
          {
            title: `${cyan('2) 基座宿主工程 (Main Host Portal)')} — 基于 Vue 3 + Rspack + @axewo 架构`,
            value: 'charsle/micro-main-public',
          },
          {
            title: `${yellow('3) SDK 核心基础库 (Core SDK Monorepo)')} — 包含 core / shared / ui`,
            value: 'charsle/micro-core-sdk',
          },
        ],
      },
      {
        type: 'text',
        name: 'projectName',
        message: '请输入目标项目/子应用文件夹名称:',
        initial: defaultAppName,
      },
      {
        type: 'confirm',
        name: 'autoInstall',
        message: '模板解压后，是否立即自动为您安装 pnpm 依赖？',
        initial: true,
      },
    ],
    {
      onCancel: () => {
        console.log(red('✖ 操作已取消'))
        process.exit(0)
      },
    },
  )

  const { templateType, projectName, autoInstall } = response
  if (!projectName) return

  const targetDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `目标文件夹 ${projectName} 已存在且不为空，是否覆盖清空？`,
      initial: false,
    })
    if (!overwrite) {
      console.log(red('✖ 操作已取消'))
      process.exit(0)
    }
    fs.emptyDirSync(targetDir)
  }

  console.log()
  console.log(yellow(`⏳ 正在从 GitHub (${templateType}) 实时拉取最新工程模板...`))

  try {
    const emitter = degit(templateType, {
      cache: false,
      force: true,
      verbose: true,
    })

    await emitter.clone(targetDir)

    // 自动更名 package.json 的 name 属性
    const pkgPath = path.join(targetDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkgJson = fs.readJsonSync(pkgPath)
      pkgJson.name = projectName
      fs.writeJsonSync(pkgPath, pkgJson, { spaces: 2 })
    }

    console.log(green(`✔ 模板拉取成功！`))

    // ===== 选择 No：不自动安装依赖，展示指引并直接退出 =====
    if (!autoInstall) {
      console.log()
      console.log(bold(green(`✨ 项目 [${projectName}] 已创建完成！`)))
      console.log()
      console.log(cyan('👉 请执行以下命令手动安装依赖并启动项目:'))
      console.log(`   cd ${projectName}`)
      console.log('   pnpm install')
      console.log('   pnpm dev')
      console.log()
      process.exit(0)
    }

    // ===== 选择 Yes：自动执行 pnpm install =====
    console.log()
    console.log(yellow(`⚙️ 正在为您自动安装项目依赖 (pnpm install)...`))
    try {
      execSync('pnpm install', {
        cwd: targetDir,
        stdio: 'inherit',
      })
      console.log(green('✔ 依赖安装完成！'))
    } catch (err) {
      console.log(yellow('⚠️ 自动 pnpm install 遇到问题，尝试使用 npm install...'))
      try {
        execSync('npm install', {
          cwd: targetDir,
          stdio: 'inherit',
        })
        console.log(green('✔ 依赖安装完成！'))
      } catch {
        console.log(red('✖ 自动安装失败，请手动进入目录运行 pnpm install'))
      }
    }

    console.log()
    console.log(bold(green(`✨ 项目 [${projectName}] 已全面准备完毕！`)))

    // ===== 2. 依赖安装完成后，才二次询问是否直接启动服务器 =====
    const { autoStart } = await prompts({
      type: 'confirm',
      name: 'autoStart',
      message: '依赖已安装就绪，是否立即自动启动开发服务器 (pnpm dev)？',
      initial: true,
    })

    if (autoStart) {
      console.log()
      console.log(cyan(`🚀 正在为您自动启动开发服务器 (pnpm dev)...`))
      console.log()

      spawn('pnpm', ['dev'], {
        cwd: targetDir,
        stdio: 'inherit',
        shell: true,
      })
    } else {
      console.log()
      console.log(cyan('👉 请执行以下命令启动项目:'))
      console.log(`   cd ${projectName}`)
      console.log('   pnpm dev')
      console.log()
    }
  } catch (err) {
    console.log(red(`✖ 下载模板失败: ${err.message}`))
    console.log(yellow('提示：请检查网络连接或 GitHub 访问状态。'))
  }
}

init().catch((e) => {
  console.error(e)
})
