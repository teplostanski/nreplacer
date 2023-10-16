#!/usr/bin/env node
// cli.ts

import { Command } from 'commander'
import { replaceInFiles } from './module.js' // Обновленный импорт
import chalk from 'chalk'
import ora from 'ora'
import cliui from 'cliui'
import dotenv from 'dotenv'

dotenv.config()

const version: string = process.env.VERSION || 'unknown'

const program = new Command()

program
  .version(version, '-v, --version')
  .description('CLI tool for searching and replacing text within files or directories.')
  .option('--nocolor', 'Disable color output')
  .option('--noverbose', 'Disable verbose output')
  .option('-f, --file <path>', 'Path to the file or directory')
  .option('-s, --search <text>', 'Text or regex to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .action(async (options) => {
    const { file: filePathOrDir, search, replace, global: globalReplace, nocolor, noverbose } = options

    const log = {
           error: nocolor ? console.error : (msg: string) => console.error(chalk.red(msg)),
      success: nocolor ? console.log : (msg: string) => console.log(chalk.green(msg)),
      info: nocolor ? console.log : (msg: string) => console.log(chalk.blue(msg)),
    }

    if (!filePathOrDir || !search || !replace) {
      log.error('Please provide required options: --file, --search, --replace')
      process.exit(1)
    }

    const spinner = ora({
      text: 'Initializing...',
      prefixText: '\n',
      color: nocolor ? 'white' : 'yellow',
    })

    spinner.start()

    try {
      const startTime = Date.now()
      const results = await replaceInFiles(filePathOrDir, search, replace, globalReplace)
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)

      spinner.stop() // Останавливаем прогресс перед выводом информации

      for (const result of results) {
        log.success(`Replaced "${chalk.yellow(search)}" with "${chalk.yellow(replace)}" in ${chalk.yellow(result.filePath)}`)
        log.info(`Matches replaced: ${chalk.yellow(result.replacedLines)}`)
      }

      const ui = cliui({ width: 80 })
      ui.div(chalk.blueBright('Time taken: '), chalk.yellowBright(`${elapsedTime}s`))

      if (!noverbose) {
        log.info(ui.toString())
      }
    } catch (error) {
      spinner.fail((error as Error).message)
      process.exit(1)
    }
  })

program.parse(process.argv)
