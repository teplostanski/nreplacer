#!/usr/bin/env node
// cli.ts

import { Command } from 'commander'
import { replaceInFile } from './module.js'
import chalk from 'chalk'
import ora from 'ora'
import cliui from 'cliui'
import dotenv from 'dotenv'

dotenv.config()

const version: string = process.env.VERSION || 'unknown'

const program = new Command()

/**
 * CLI tool for searching and replacing text within files.
 *
 * @example
 * To run the CLI:
 * ```bash
 * nreplacer -f ./path/to/file.txt -s oldText -r newText
 * ```
 *
 * For global replacement:
 * ```bash
 * nreplacer -f ./path/to/file.txt -s oldText -r newText -g
 * ```
 */
program
  .version(version, '-v, --version')
  .description('pkg.description')
  .option('--nocolor', 'Disable color output')
  .option('--noverbose', 'Suppress detailed output')
  .option('-f, --file <path>', 'Path to the file')
  .option('-s, --search <text>', 'Text or regex to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .action(async (options) => {
    const { file, search, replace, global: globalReplace, nocolor, noverbose } = options

    const log = {
      error: nocolor ? console.error : (msg: string) => console.error(chalk.red(msg)),
      success: nocolor ? console.log : (msg: string) => console.log(chalk.green(msg)),
      info: nocolor ? console.log : (msg: string) => console.log(chalk.blue(msg)),
    }

    if (!file || !search || !replace) {
      log.error('Please provide required options: --file, --search, --replace')
      process.exit(1)
    }

    const spinner = ora({
      text: 'Initializing...',
      prefixText: '\n',
      color: nocolor ? 'white' : 'yellow',
    })

    if (noverbose) {
      spinner.stop()
    } else {
      spinner.start()
    }

    try {
      const startTime = Date.now()
      const results = await replaceInFile(file, search, replace, globalReplace)
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)

      if (!noverbose) {
        spinner.succeed(`Replaced "${chalk.yellow(search)}" with "${chalk.yellow(replace)}" in ${chalk.yellow(file)}`)

        const ui = cliui({ width: 80 })
        ui.div(chalk.blueBright('Time taken: '), chalk.yellowBright(`${elapsedTime}s`))
        ui.div(chalk.blueBright('Matches replaced: '), chalk.yellowBright(`${results.replacedLines}`))

        log.info(ui.toString())
      }
    } catch (error) {
      if (!noverbose) {
        spinner.fail((error as Error).message)
      }
      process.exit(1)
    }
  })

program.parse(process.argv)
