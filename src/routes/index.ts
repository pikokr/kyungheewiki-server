import type { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async () => {
    return { hello: 'world' }
  })
}
