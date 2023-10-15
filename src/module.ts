// src/replaceModule.ts

import fs from 'fs'
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import fileType from 'file-type'

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
 * @example
 * ```typescript
 * import { replaceInFile } from './replaceModule';
 *
 * (async () => {
 *   await replaceInFile('./sample.txt', 'Hello', 'Hi');
 * })();
 * ```
 *
 * @example
 * ```typescript
 * import { replaceInFile } from './replaceModule';
 *
 * (async () => {
 *   await replaceInFile('./sample.txt', /Hello/g, 'Hi');
 * })();
 * ```
 */
export async function replaceInFile(filePath: string, searchValue: string | RegExp, replaceValue: string, globalReplace = false): Promise<void> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const type = await fileType.fromFile(filePath)

  if (type && !type.mime.startsWith('text/')) {
    throw new Error(`Unsupported file type: ${type.mime}. This tool is intended for text files.`)
  }

  const readStream = createReadStream(filePath, { encoding: 'utf8' })
  const writeStream = createWriteStream(filePath + '.tmp', { encoding: 'utf8' })

  const replaceStream = new Transform({
    transform(chunk, _, callback) {
      let data = chunk.toString()
      if (typeof searchValue === 'string' && globalReplace) {
        searchValue = new RegExp(searchValue, 'g')
      }
      data = data.replace(searchValue, replaceValue)
      this.push(data)
      callback()
    },
  })

  readStream
    .pipe(replaceStream)
    .pipe(writeStream)
    .on('finish', function () {
      fs.renameSync(filePath + '.tmp', filePath)
    })
}
