import { RouteHandler } from 'fastify'
import { Session } from '~/models'
import { ErrorCode } from '~/utils/errors'
import { getUser } from '~/utils/users'

export const logout: RouteHandler = async (req, reply) => {
  const token = req.headers.authorization?.slice('Bearer '.length) ?? ''

  const session = await Session.findOne({ accessToken: token })

  if (!session) {
    return reply.status(400).send({
      code: ErrorCode.ValidationError,
      message: 'Session not found.',
    })
  }

  await session.delete()

  return { ok: 1 }
}
