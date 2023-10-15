import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const readdirAsync = promisify(fs.readdir)
const statAsync = promisify(fs.stat)

/**
 * Escape special characters for a string to be safely used in regular expressions.
 *
 * @param string - The string to be escaped.
 * @returns The escaped string.
 *
 * @example
 * const safeString = escapeRegExp(".*+");
 * console.log(safeString); // \.\*\+
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

interface ReplaceResult {
  replacedLines: number
}

/**
 * Replace occurrences in a specific file.
 *
 * @param filePath - The path to the target file.
 * @param search - The string or regular expression to search for.
 * @param replace - The replacement string.
 * @param isGlobal - Flag indicating if all occurrences should be replaced.
 *
 * @returns A promise resolving to the replacement result.
 *
 * @example
 * replaceInFile('path/to/file.txt', 'Hello', 'Hi', true)
 *   .then(result => console.log(`Replaced lines: ${result.replacedLines}`))
 */
async function replaceInFile(filePath: string, search: string | RegExp, replace: string, isGlobal: boolean): Promise<ReplaceResult> {
  const content = await readFileAsync(filePath, 'utf-8')

  let regex: RegExp
  if (typeof search === 'string') {
    regex = new RegExp(escapeRegExp(search), isGlobal ? 'g' : '')
  } else {
    regex = new RegExp(search, isGlobal ? 'g' : '')
  }

  const matches = content.match(regex)
  if (!matches) return { replacedLines: 0 }

  const newContent = content.replace(regex, replace)
  await writeFileAsync(filePath, newContent, 'utf-8')

  return { replacedLines: matches.length }
}

/**
 * Recursively replace occurrences in files within a directory or in a specific file.
 *
 * @param filePathOrDir - The path to the directory or file.
 * @param search - The string or regular expression to search for.
 * @param replace - The replacement string.
 * @param isGlobal - Flag indicating if all occurrences should be replaced.
 *
 * @returns A promise resolving to the cumulative replacement result.
 *
 * @example
 * // Replace in a specific file
 * replaceInFiles('path/to/file.txt', 'Hello', 'Hi', true)
 *   .then(result => console.log(`Replaced lines: ${result.replacedLines}`));
 *
 * // Replace in all files in a directory
 * replaceInFiles('path/to/dir', 'Hello', 'Hi', true)
 *   .then(result => console.log(`Replaced lines in directory: ${result.replacedLines}`));
 */
async function replaceInFiles(filePathOrDir: string, search: string | RegExp, replace: string, isGlobal: boolean): Promise<ReplaceResult> {
  const stats = await statAsync(filePathOrDir)
  let totalReplacedLines = 0

  if (stats.isDirectory()) {
    const items = await readdirAsync(filePathOrDir)
    for (const item of items) {
      const fullPath = path.join(filePathOrDir, item)
      const result = await replaceInFiles(fullPath, search, replace, isGlobal)
      totalReplacedLines += result.replacedLines
    }
  } else {
    const result = await replaceInFile(filePathOrDir, search, replace, isGlobal)
    totalReplacedLines += result.replacedLines
  }

  return { replacedLines: totalReplacedLines }
}

export { replaceInFiles }
