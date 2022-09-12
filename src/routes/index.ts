import type { FastifyPluginAsync } from 'fastify'
import { ZodError } from 'zod'
import { logger } from '~/logger'
import { ErrorCode } from '~/utils/errors'
import { UnauthorizedError, getUser } from '~/utils/users'

import { authRoutes } from './auth'

export const routes: FastifyPluginAsync = async (server) => {
  server.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError)
      return reply.status(400).send({
        code: ErrorCode.ValidationError,
        issues: err.issues,
      })

    if (err instanceof UnauthorizedError)
      return reply.status(401).send({
        code: ErrorCode.Unauthorized,
        message: 'Unauthorized',
      })

    logger.error(err)

    return reply.status(500).send({
      type: ErrorCode.InternalServerError,
      message: 'Internal Server Error',
    })
  })

  server.get('/', async () => {
    return { hello: 'world' }
  })

  server.get('/me', async (req) => {
    const user = (await getUser(req))!

    return user.toAPIUser()
  })

  server.register(authRoutes, { prefix: '/auth' })
}
