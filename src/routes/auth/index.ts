import { FastifyPluginAsync } from 'fastify'

import { login } from './login'

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/login', login)
}
