// src/replaceModule.ts

import fs from 'fs'
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import fileType from 'file-type'

export async function replaceInFile(filePath: string, searchValue: string, replaceValue: string, globalReplace = false): Promise<void> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const type = await fileType.fromFile(filePath) // Используйте асинхронный метод

  if (type && !type.mime.startsWith('text/')) {
    throw new Error(`Unsupported file type: ${type.mime}. This tool is intended for text files.`)
  }

  const readStream = createReadStream(filePath, { encoding: 'utf8' })
  const writeStream = createWriteStream(filePath + '.tmp', { encoding: 'utf8' })

  const replaceStream = new Transform({
    transform(chunk, _, callback) {
      let data = chunk.toString()
      const regex = globalReplace ? new RegExp(searchValue, 'g') : new RegExp(searchValue)
      data = data.replace(regex, replaceValue)
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
