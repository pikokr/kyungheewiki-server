import { FastifyPluginAsync } from 'fastify'

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => 'auth')
}
