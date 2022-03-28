import express from 'express'
import promClient from 'prom-client'

export class PromServer {
  private port: number
  private register: promClient.Registry
  private server: express.Express

  constructor(port = 9095) {
    this.port = port
    this.register = new promClient.Registry()
    this.server = express()
  }

  async start() {
    // Enable collection of default metrics
    promClient.collectDefaultMetrics({
      register: this.register,
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
    })

    this.server.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', this.register.contentType)
        res.end(await this.register.metrics())
      } catch (ex) {
        res.status(500).end(ex)
      }
    })

    this.server.listen(this.port)
    console.log(`Server listening on ${this.port}, metrics exposed on /metrics endpoint`)
  }
}
