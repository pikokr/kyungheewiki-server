import chalk from 'chalk'
import 'dotenv/config'
import fastify from 'fastify'
import mongoose from 'mongoose'

import { logger } from './logger'
import './models'
import { routes } from './routes'

process.on('unhandledRejection', (err) => {
  logger.fatal('Unhandled rejection', err)
})

process.on('uncaughtException', (err) => {
  logger.fatal('Uncaught exception', err)
})

const server = fastify()

server.register(routes)

setImmediate(async () => {
  await mongoose.connect(process.env.DB_DSN!)

  logger.info('Connected to database.')

  const addr = await server.listen({
    port: +(process.env.PORT || 3000),
    host: process.env.HOST || '0.0.0.0',
  })

  logger.info(`Server listening on ${chalk.blue(addr)}`)
})
