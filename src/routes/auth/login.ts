import bcrypt from 'bcrypt'
import type { cryptoRandomStringAsync as cryptoRandomStringAsyncFn } from 'crypto-random-string'
import { RouteHandler } from 'fastify'
import { Session, User } from '~/models'

import { loginSchema } from './validation'

export const login: RouteHandler = async (req, reply) => {
  const cryptoRandomStringAsync: typeof cryptoRandomStringAsyncFn = (
    await eval('import("crypto-random-string")')
  ).cryptoRandomStringAsync

  const body = await loginSchema.parseAsync(req.body)

  const user = await User.findOne({
    email: body.email,
  })

  const sendAuthError = () =>
    reply.status(401).send({
      message: '이메일 또는 비밀번호가 잘못 되었습니다',
    })

  if (!user) return sendAuthError()

  if (!(await bcrypt.compare(body.password, user.password))) {
    return sendAuthError()
  }

  const accessToken = `${Buffer.from(`${Date.now()}`).toString(
    'base64'
  )}.${await cryptoRandomStringAsync({ length: 64 })}`

  const refreshToken = `${Buffer.from(`${Date.now()}`).toString(
    'base64'
  )}.${await cryptoRandomStringAsync({ length: 64 })}`

  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7

  const session = new Session()

  session.accessToken = accessToken

  session.refreshToken = refreshToken

  session.tokenExpiresAt = new Date(expiresAt)

  await session.save()

  return { accessToken, refreshToken, expiresAt }
}
