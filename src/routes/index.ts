import type { FastifyPluginAsync } from 'fastify'
import { ZodError } from 'zod'
import { logger } from '~/logger'

import { authRoutes } from './auth'

export const routes: FastifyPluginAsync = async (server) => {
  server.setErrorHandler((err, req, reply) => {
    if (!(err instanceof ZodError)) return

    return reply.status(400).send({
      type: 'validationError',
      issues: err.issues,
    })
  })

  server.get('/', async () => {
    return { hello: 'world' }
  })

  server.register(authRoutes, { prefix: '/auth' })
}
