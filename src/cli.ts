#!/usr/bin/env node
// cli.ts

import { Command } from 'commander'
import { replaceInFile } from './module.js'
import chalk from 'chalk'
import ora from 'ora'
import { SingleBar, Presets } from 'cli-progress'

import dotenv from 'dotenv'
dotenv.config()

const version: string = process.env.VERSION || 'unknown'

const program = new Command()

/**
 * CLI tool to search and replace text in files.
 *
 * @example
 * Running the CLI:
 * ```bash
 * nreplacer -f ./path/to/file.txt -s oldText -r newText
 * ```
 *
 * Using global replacement:
 * ```bash
 * nreplacer -f ./path/to/file.txt -s oldText -r newText -g
 * ```
 */

program
  .version(version, '-v, --version')
  .description('pkg.description')
  .option('--nocolor', 'Disable color output')
  .option('--verbose', 'Enable verbose output')
  .option('-f, --file <path>', 'Path to the file')
  .option('-s, --search <text>', 'Text or regex to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .option('--hello-creator', 'Display a special message from the creator')
  .action(async (options) => {
    const { file, search, replace, global: globalReplace, nocolor, verbose, helloCreator } = options

    const log = {
      error: nocolor ? console.error : (msg: string) => console.error(chalk.red(msg)),
      success: nocolor ? console.log : (msg: string) => console.log(chalk.green(msg)),
      info: nocolor ? console.log : (msg: string) => console.log(chalk.blue(msg)),
    }

    if (helloCreator) {
      log.info("Error 418: I can't brew coffee because I'm a teapot, but you can treat me!")
      process.exit(0) // Завершаем выполнение, так как это пасхалка
    }

    if (!file || !search || !replace) {
      log.error('Please provide required options: --file, --search, --replace')
      process.exit(1)
    }

    const spinner = ora({
      text: 'Initializing...',
      color: nocolor ? 'white' : 'yellow',
    })

    const progressBar = new SingleBar({}, Presets.shades_classic)
    progressBar.start(100, 0)

    try {
      spinner.text = 'Replacing text...'
      spinner.start()
      await replaceInFile(file, search, replace, globalReplace)
      spinner.succeed(`Replaced "${search}" with "${replace}" in ${file}`)
      progressBar.update(100)
      progressBar.stop()
      if (verbose) {
        log.info(`Detailed info: Replaced "${search}" with "${replace}" in ${file}`)
      }
    } catch (error) {
      spinner.fail((error as Error).message)
      progressBar.stop()
      process.exit(1)
    }
  })

program.parse(process.argv)
