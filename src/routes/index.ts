import type { FastifyPluginAsync } from 'fastify'

import { authRoutes } from './auth'

export const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async () => {
    return { hello: 'world' }
  })

  server.register(authRoutes, { prefix: '/auth' })
}
