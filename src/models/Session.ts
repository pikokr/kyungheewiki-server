import mongoose from 'mongoose'

export interface ISession {
  user: mongoose.Types.ObjectId

  accessToken: string
  refreshToken: string
  tokenExpiresAt: Date
}

const schema = new mongoose.Schema<ISession>({
  accessToken: {
    type: 'string',
    required: true,
    unique: true,
  },
  refreshToken: {
    type: 'string',
    required: true,
    unique: true,
  },
  tokenExpiresAt: {
    type: 'date',
    required: true,
  },
  user: {
    type: 'ObjectId',
    required: true,
    ref: 'User',
  },
})

export const Session = mongoose.model('Session', schema, 'sessions')
