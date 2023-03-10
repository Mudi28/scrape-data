import minimist from 'minimist'
import path from 'path'
import os from 'os'
import fsPromises from 'fs/promises'
import { logger } from './logger.mjs'
async function exportData(products) {
  // parse command line arguments using minimist
  const args = minimist(process.argv.slice(2), {
    string: ['export_format'], // 'export' as a string argument
    alias: { e: 'export_format' }, // '-e' as an alias for 'export'
  })

  // check if the `--export_format` argument is provided and its value
  const exportFormat = args.export_format && args.export_format.toUpperCase()
  if (!exportFormat) {
    // if export format is not specified, don't export anything
    return
  }

  // create a folder for the exported files, if it doesn't already exist
  const folderPath = path.join(process.cwd(), 'export-data')
  try {
    await fsPromises.mkdir(folderPath, { recursive: true })
    logger(` Directory ${folderPath} found successfully! `, {
      console: true,
      file: false,
    })
  } catch (error) {
    logger(`Error creating directory: ${error}`, {
      console: true,
      file: true,
      filename: 'error.log',
    })
  }

  // export data to a json file
  if (exportFormat === 'JSON') {
    const jsonData = JSON.stringify(products)
    const filePath = path.join(folderPath, 'product.json')
    try {
      await fsPromises.writeFile(filePath, jsonData)
      console.log('Correct export format. Data exported to product.json')
      logger(`Correct export format. Data exported to product.json`, {
        console: true,
        file: true,
        filename: 'correct.log',
      })
    } catch (error) {
      logger(`Error exporting data: ${error}`, {
        console: true,
        file: true,
        filename: 'error.log',
      })
    }

    // export data to a csv file
  } else if (exportFormat === 'CSV') {
    const csvData = `name,image,url,price${os.EOL}${products
      .map(
        (product) =>
          `${product.name},${product.image},${product.url},${product.price}`,
      )
      .join(os.EOL)}`
    const filePath = path.join(folderPath, 'product.csv')
    try {
      await fsPromises.writeFile(filePath, csvData)
      console.log('Correct export format. Data exported to product.csv')
      logger(`Correct export format. Data exported to product.csv`, {
        console: true,
        file: true,
        filename: 'correct.log',
      })
    } catch (error) {
      logger(`Error exporting data: ${error}`, {
        console: true,
        file: true,
        filename: 'error.log',
      })
    }
  } else if (exportFormat) {
    logger(`Invalid export format. Only CSV and JSON are supported.`, {
      console: true,
      file: true,
      filename: 'error.log',
    })
  }
}
export { exportData }
