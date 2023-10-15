// module.ts
import fs from 'fs'
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import fileType from 'file-type'

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
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
 * @returns {Promise<{ totalTime: number, replacedLines: number }>} - A promise that resolves with an object containing the total execution time and the number of lines replaced.
 *
 * @example
 * ```typescript
 * import { replaceInFile } from './replaceModule';
 *
 * (async () => {
 *   const result = await replaceInFile('./sample.txt', 'Hello', 'Hi');
 *   console.log(`Total time: ${result.totalTime}ms`);
 *   console.log(`Replaced lines: ${result.replacedLines}`);
 * })();
 * ```
 */
export async function replaceInFile(filePath: string, searchValue: string | RegExp, replaceValue: string, globalReplace = false): Promise<{ totalTime: number; replacedLines: number }> {
  // Start the timer for execution time
  const startTime = Date.now()

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

  if (typeof searchValue === 'string') {
    if (globalReplace) {
      searchValue = new RegExp(escapeRegExp(searchValue), 'g')
    } else {
      searchValue = new RegExp(escapeRegExp(searchValue))
    }
  }

  // Stream to handle the search and replace
  const replaceStream = new Transform({
    transform(chunk, _, callback) {
      let data = chunk.toString()

      // Подсчет всех совпадений в этом чанке
      const matches = (data.match(searchValue) || []).length
      totalMatches += matches

      // Замена текста в этом чанке
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
        const totalTime = Date.now() - startTime
        resolve({ totalTime, replacedLines: totalMatches })
      })
      .on('error', reject)
  })
}
