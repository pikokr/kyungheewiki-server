import { FastifyPluginAsync } from 'fastify'

import { login } from './login'
import { logout } from './logout'
import { signUp } from './signup'

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/login', login)
  server.post('/signup', signUp)
  server.get('/logout', logout)
}
