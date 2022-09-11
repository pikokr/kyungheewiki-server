import { FastifyRequest } from 'fastify'
import { IUser, IUserMethods, Session } from '~/models'

export class UnauthorizedError extends Error {}

const tokenPrefix = 'Bearer '

export const getUser = async (req: FastifyRequest, required = true) => {
  const err = () => {
    if (required) {
      throw new UnauthorizedError()
    }
    return null
  }
  let token = await req.headers.authorization

  if (!token || !token.startsWith(tokenPrefix)) return err()

  token = token.slice(tokenPrefix.length)

  const session = await Session.findOne({ accessToken: token, tokenExpiresAt: { $gt: Date.now() } })
    .populate<{ user: IUser & IUserMethods }>('user')
    .orFail()
    .catch(() => null)

  if (!session) return err()

  return session.user
}
