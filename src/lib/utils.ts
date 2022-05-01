import { BigNumberish, utils } from 'ethers'
import { writeFileSync, readFileSync, statSync } from 'fs'
import axios from 'axios'

const CACHE_MS = 3600000
const BLOCK_FILE = 'last-block.json'

export class Utils {
  public static lastBlock: { [chainId: string]: number } = { '1': 0, '56': 0, '137': 0 }

  public static sleep(ms: number) {
    if (ms === 0) {
      return
    }
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public static formatUnits(value: BigNumberish, decimals: number) {
    return parseFloat(utils.formatUnits(value, decimals))
  }

  public static async cacheFile(url: string, file: string) {
    let jsonString: string

    let mtime = 0
    try {
      const stats = statSync(file)
      mtime = stats.mtime.getTime()
    } catch {
      //file doesn't exist
      const data = await this.downloadFile(url)
      if (data != undefined) {
        this.saveFile(file, data)
        return data
      } else {
        console.log(`Error downloading ${url} and cached file not found on disk`)
        process.exit(1)
      }
    }

    if (mtime < Date.now() - CACHE_MS) {
      //cache expired
      const data = await this.downloadFile(url)
      if (data != undefined) {
        this.saveFile(file, data)
        jsonString = data
      } else {
        console.log('Using stale', file)
        jsonString = readFileSync(file, 'utf-8')
      }
    } else {
      //cache not expired
      jsonString = readFileSync(file, 'utf-8')
    }
    return jsonString
  }

  public static async downloadFile(url: string): Promise<string | undefined> {
    const jsonString = axios
      .get(url)
      .then(response => {
        return JSON.stringify(response.data)
      })
      .catch(err => {
        console.log(err)
        return undefined
      })
    return jsonString
  }

  public static saveFile(file: string, data: string) {
    writeFileSync(file, data, 'utf-8')
  }

  public static saveLastBlock(chainId: string, block: number) {
    this.lastBlock[chainId] = block
    this.saveFile(BLOCK_FILE, JSON.stringify(this.lastBlock))
  }

  public static getLastBlock(chainId: string) {
    const json = JSON.parse(readFileSync(BLOCK_FILE, 'utf-8'))
    return json[chainId] || -10
  }
}
