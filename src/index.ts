#!/usr/bin/env node

import { Command } from 'commander'
import { replaceInFile } from './module'

const program = new Command()

program
  .version('1.0.0')
  .description('Search and replace text in files')
  .option('-f, --file <path>', 'Path to the file')
  .option('-s, --search <text>', 'Text to search for')
  .option('-r, --replace <text>', 'Text to replace with')
  .option('-g, --global', 'Replace all occurrences', false)
  .action((options) => {
    const { file, search, replace, global: globalReplace } = options

    if (!file || !search || !replace) {
      console.error('Please provide required options: --file, --search, --replace')
      process.exit(1)
    }

    try {
      replaceInFile(file, search, replace, globalReplace)
      console.log(`Replaced "${search}" with "${replace}" in ${file}`)
    } catch (error) {
      console.error((error as Error).message)
      process.exit(1)
    }
  })

program.parse(process.argv)
export { replaceInFile }
