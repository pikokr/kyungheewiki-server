import { FastifyPluginAsync } from 'fastify'

import { login } from './login'
import { signUp } from './signup'

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/login', login)
  server.post('/signup', signUp)
}
