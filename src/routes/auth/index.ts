import { FastifyPluginAsync } from 'fastify'

import { login } from './login'
import { logout } from './logout'
import { refreshSession } from './refresh'
import { signUp } from './signup'

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/login', login)
  server.post('/signup', signUp)
  server.post('/refresh', refreshSession)
  server.get('/logout', logout)
}
