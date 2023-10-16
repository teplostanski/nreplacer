/**
 * @fileoverview Module for searching and replacing text within files or directories.
 * @module module
 */

import fs from 'fs'
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import fileType from 'file-type'

/**
 * Represents the result of a single file replacement operation.
 */
interface ReplaceResult {
  /**
   * The path to the file where replacements were made.
   */
  filePath: string
  /**
   * The number of lines where replacements were made.
   */
  replacedLines: number
}

/**
 * Replaces occurrences of a search string or regular expression with a given replacement string in a file.
 *
 * @param filePath - The path to the target file.
 * @param searchValue - The string or regular expression to search for.
 * @param replaceValue - The string to replace matched values with.
 * @param globalReplace - If true and searchValue is a string, replace all occurrences. Default is false.
 *
 * @throws {Error} - Throws an error if the file does not exist or is not a text file.
 *
 * @returns {Promise<ReplaceResult>} - A promise that resolves with an object containing the file path and the number of lines replaced.
 */
async function replaceInFile(filePath: string, searchValue: string | RegExp, replaceValue: string, globalReplace = false): Promise<ReplaceResult> {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  // Determine file type and ensure it's a text file
  const type = await fileType.fromFile(filePath)
  if (type && !type.mime.startsWith('text/')) {
    throw new Error(`Unsupported file type: ${type.mime}. This tool is intended for text files.`)
  }

  const readStream = createReadStream(filePath, { encoding: 'utf8' })
  const writeStream = createWriteStream(filePath + '.tmp', { encoding: 'utf8' })

  let totalMatches = 0

  // Stream to handle the search and replace
  const replaceStream = new Transform({
    transform(chunk, _, callback) {
      let data = chunk.toString()

      if (typeof searchValue === 'string' && globalReplace) {
        searchValue = new RegExp(searchValue, 'g')
      }

      // Count all matches in this chunk
      const matches = (data.match(searchValue) || []).length
      totalMatches += matches

      // Replace text in this chunk
      data = data.replace(searchValue, replaceValue)

      callback(null, data)
    },
  })

  // Pipe the read data through the replace stream and then write the modified data back to a temporary file
  return new Promise((resolve, reject) => {
    readStream
      .pipe(replaceStream)
      .pipe(writeStream)
      .on('finish', function () {
        // Rename the temporary file to the original filename
        fs.renameSync(filePath + '.tmp', filePath)
        resolve({ filePath, replacedLines: totalMatches })
      })
      .on('error', reject)
  })
}

/**
 * Replaces occurrences of a search string or regular expression with a given replacement string in files within a directory.
 *
 * @param filePathOrDir - The path to the target file or directory.
 * @param searchValue - The string or regular expression to search for.
 * @param replaceValue - The string to replace matched values with.
 * @param globalReplace - If true and searchValue is a string, replace all occurrences. Default is false.
 *
 * @returns {Promise<ReplaceResult[]>} - A promise that resolves with an array of objects containing file paths and the number of lines replaced.
 */
async function replaceInFiles(filePathOrDir: string, searchValue: string | RegExp, replaceValue: string, globalReplace = false): Promise<ReplaceResult[]> {
  const replaceResults: ReplaceResult[] = []

  // Recursive function to process directories and files
  async function processPath(path: string) {
    const stat = fs.statSync(path)

    if (stat.isDirectory()) {
      const files = fs.readdirSync(path)

      for (const file of files) {
        await processPath(`${path}/${file}`)
      }
    } else if (stat.isFile()) {
      const result = await replaceInFile(path, searchValue, replaceValue, globalReplace)
      replaceResults.push(result)
    }
  }

  await processPath(filePathOrDir)

  return replaceResults
}

export { replaceInFiles }
