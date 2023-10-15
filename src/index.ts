#!/usr/bin/env node

import { Command } from 'commander'
import { replaceInFile } from './module'
import pkg from '../package.json' // Путь может отличаться в зависимости от структуры вашего проекта

/**
 * Command Line Interface (CLI) utility for searching and replacing text in files.
 * Provides options to specify the file, search pattern, replacement text, and whether the replacement should be global.
 *
 * @example
 * ```bash
 * $ nreplacer --file ./sample.txt --search Hello --replace Hi
 * ```
 *
 * @example
 * ```bash
 * $ nreplacer --file ./sample.txt --search /Hello/g --replace Hi
 * ```
 */
const program = new Command()

program
  .version(pkg.version, '-v, --version') // Используйте версию из package.json
  .description(pkg.description) // Используйте описание из package.json
  .option('-f, --file <path>', 'Path to the file')
  .option('-s, --search <text>', 'Text to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .action(async (options) => {
    const { file, search, replace, global: globalReplace } = options

    if (!file || !search || !replace) {
      console.error('Please provide required options: --file, --search, --replace')
      process.exit(1)
    }

    try {
      await replaceInFile(file, search, replace, globalReplace)
      console.log(`Replaced "${search}" with "${replace}" in ${file}`)
    } catch (error) {
      console.error((error as Error).message)
      process.exit(1)
    }
  })

program.parse(process.argv)
