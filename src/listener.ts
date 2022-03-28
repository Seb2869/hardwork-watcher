import { ethers } from 'ethers'
import { Controller__factory } from '../types/ethers-contracts'
import { PromServer, CacheProvider, Utils } from './lib'
import { ControllerHandler, Addresses } from './contracts'
import config from '../config.json'

export class Listener {
  public static async start() {
    console.log('Starting events listener')

    const cacheProvider = new CacheProvider()
    const promServer = new PromServer(Number(config.port) || 9095)
    promServer.start()

    const polygonProvider = new ethers.providers.JsonRpcProvider(config.polygon.provider)
    const polygonLookback = config.polygon.lookbackHarvests || false
    const polygonAddresses = new Addresses('polygon')
    const polygonController = Controller__factory.connect(
      polygonAddresses.controller,
      polygonProvider,
    )
    const polygonControllerHandler = new ControllerHandler(
      polygonProvider,
      cacheProvider.instance(),
    )
    const bscProvider = new ethers.providers.JsonRpcProvider(config.bsc.provider)
    const bscLookback = config.bsc.lookbackHarvests || false
    const bscAddresses = new Addresses('bsc')
    const bscController = Controller__factory.connect(bscAddresses.controller, bscProvider)
    const bscControllerHandler = new ControllerHandler(bscProvider, cacheProvider.instance())

    if (polygonLookback) {
      const lastBlock = Utils.getLastBlock(polygonAddresses.chainId)
      console.log('Starting with Polygon lookback from block ' + lastBlock)
      const events = await polygonController.queryFilter(
        polygonController.filters.SharePriceChangeLog(),
        lastBlock,
        'latest',
      )

      for (const event of events) {
        await polygonControllerHandler.handleHardWork(
          event.args.vault,
          event.args.strategy,
          event.args.oldSharePrice,
          event.args.newSharePrice,
          event.args.timestamp,
          await event.getTransactionReceipt(),
          polygonAddresses,
        )
        await Utils.sleep(500)
      }
      console.log('Polygon lookback done.')
    }

    polygonController.on(
      polygonController.filters.SharePriceChangeLog(),
      async (vault, strategy, oldSharePrice, newSharePrice, timestamp, event) => {
        await polygonControllerHandler.handleHardWork(
          vault,
          strategy,
          oldSharePrice,
          newSharePrice,
          timestamp,
          await event.getTransactionReceipt(),
          polygonAddresses,
        )
      },
    )
    console.log('Subscribed to Polygon controller events.')

    if (bscLookback) {
      const lastBlock = Utils.getLastBlock(bscAddresses.chainId)
      console.log('Starting with BSC lookback from block ' + lastBlock)
      const events = await bscController.queryFilter(
        bscController.filters.SharePriceChangeLog(),
        lastBlock,
        'latest',
      )

      for (const event of events) {
        await bscControllerHandler.handleHardWork(
          event.args.vault,
          event.args.strategy,
          event.args.oldSharePrice,
          event.args.newSharePrice,
          event.args.timestamp,
          await event.getTransactionReceipt(),
          bscAddresses,
        )
        await Utils.sleep(500)
      }
      console.log('BSC lookback done.')
    }

    bscController.on(
      bscController.filters.SharePriceChangeLog(),
      async (vault, strategy, oldSharePrice, newSharePrice, timestamp, event) => {
        await bscControllerHandler.handleHardWork(
          vault,
          strategy,
          oldSharePrice,
          newSharePrice,
          timestamp,
          await event.getTransactionReceipt(),
          bscAddresses,
        )
      },
    )
    console.log('Subscribed to BSC controller events.')
  }
}
