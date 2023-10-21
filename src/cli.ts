#!/usr/bin/env node
// cli.ts

import { Command } from 'commander'
import { replaceInFiles } from './module.js'
import chalk from 'chalk'
import boxen from 'boxen'
import dotenv from 'dotenv'

dotenv.config()

const version: string = process.env.VERSION || 'unknown'

const program = new Command()

program
  .version(version, '-v, --version')
  .description('CLI tool for searching and replacing text within files or directories.')
  .option('--noprint', 'Disable output printing')
  .option('--nocolor', 'Disable color output')
  .option('-f, --file <path>', 'Path to the file or directory')
  .option('-s, --search <text>', 'Text or regex to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .action(async (options) => {
    const { file: filePathOrDir, search, replace, global: globalReplace, noprint, nocolor } = options

    const log = {
      error: nocolor ? console.error : (msg: string) => console.error(chalk.red(msg)),
      success: nocolor ? console.log : (msg: string) => console.log(chalk.green(msg)),
      info: nocolor ? console.log : (msg: string) => console.log(chalk.blue(msg)),
    }

    if (!filePathOrDir || !search || !replace) {
      if (!noprint) {
        log.error('Please provide the required options: --file, --search, --replace')
      }
      process.exit(1)
    }

    try {
      const hrStartTime = process.hrtime()
      const results = await replaceInFiles(filePathOrDir, search, replace, globalReplace)
      const hrElapsedTime = process.hrtime(hrStartTime)
      const seconds = hrElapsedTime[0]
      const milliseconds = Math.floor(hrElapsedTime[1] / 1000000)
      const microseconds = Math.floor((hrElapsedTime[1] / 1000) % 1000)

      if (!noprint) {
        let totalReplacements = 0

        for (const result of results) {
          totalReplacements += result.replacedLines
        }

        if (totalReplacements > 0) {
          let output = `Replaced "${chalk.yellow(search)}" with "${chalk.yellow(replace)}" in:\n`
          for (const result of results) {
            if (result.replacedLines > 0) {
              output += `${chalk.yellow(result.filePath)} | Matches replaced: ${chalk.yellow(result.replacedLines)}\n`
            }
          }
          output += `\n${chalk.blueBright('Time taken:')} ${chalk.yellowBright(`${seconds}s ${milliseconds}.${microseconds}ms`)}`
          log.info(
            boxen(output, {
              padding: 0.5,
              //borderColor: 'yellow',
              //margin: 1,
            }),
          )
        } else {
          log.info(`${chalk.yellow('Warn:')} No matches were replaced in any file.`)
        }
      }
    } catch (error) {
      if (!noprint) {
        log.error((error as Error).message)
      }
      process.exit(1)
    }
  })

program.parse(process.argv)
