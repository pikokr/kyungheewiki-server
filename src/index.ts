import chalk from 'chalk'
import 'dotenv/config'
import fastify from 'fastify'

import { logger } from './logger'

const server = fastify()

setImmediate(async () => {
  const addr = await server.listen({
    port: +(process.env.PORT || 3000),
    host: process.env.HOST || '0.0.0.0',
  })

  logger.info(`Server listening on ${chalk.blue(addr)}`)
})
