import bcrypt from 'bcrypt'
import type { cryptoRandomStringAsync as cryptoRandomStringAsyncFn } from 'crypto-random-string'
import { RouteHandler } from 'fastify'
import { Class, Session, User } from '~/models'

import { signUpSchema } from './validation'

export const signUp: RouteHandler = async (req, reply) => {
  const cryptoRandomStringAsync: typeof cryptoRandomStringAsyncFn = (
    await eval('import("crypto-random-string")')
  ).cryptoRandomStringAsync

  const body = await signUpSchema.parseAsync(req.body)

  const clazz = await Class.findOne({ classCode: body.classCode })

  if (!clazz) return reply.status(400).send({ message: '반을 찾을 수 없습니다' })

  const salt = await bcrypt.genSalt()

  let user = new User()

  user.name = body.name
  user.email = body.email
  user.password = await bcrypt.hash(body.password, salt)
  user.class = clazz._id
  user.classNum = body.classNum

  user = await user.save()

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

  session.user = user._id

  await session.save()

  return { accessToken, refreshToken, expiresAt }
}
