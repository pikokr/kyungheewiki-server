import type { cryptoRandomStringAsync as cryptoRandomStringAsyncFn } from 'crypto-random-string'
import { RouteHandler } from 'fastify'
import { Session } from '~/models'
import { ErrorCode } from '~/utils/errors'

import { refreshSessionSchema } from './validation'

export const refreshSession: RouteHandler = async (req, reply) => {
  const cryptoRandomStringAsync: typeof cryptoRandomStringAsyncFn = (
    await eval('import("crypto-random-string")')
  ).cryptoRandomStringAsync

  const body = await refreshSessionSchema.parseAsync(req.body)

  const session = await Session.findOne({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    tokenExpiresAt: body.expiresAt,
  })

  if (!session) {
    return reply.status(404).send({
      code: ErrorCode.NotFound,
      message: 'Session not found.',
    })
  }

  const accessToken = `${Buffer.from(`${Date.now()}`).toString(
    'base64'
  )}.${await cryptoRandomStringAsync({ length: 64 })}`

  const refreshToken = `${Buffer.from(`${Date.now()}`).toString(
    'base64'
  )}.${await cryptoRandomStringAsync({ length: 64 })}`

  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7

  session.accessToken = accessToken

  session.refreshToken = refreshToken

  session.tokenExpiresAt = new Date(expiresAt)

  await session.save()

  return { accessToken, refreshToken, expiresAt }
}
