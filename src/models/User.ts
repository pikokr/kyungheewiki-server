import mongoose from 'mongoose'

export interface IUser {
  name: string // 이름
  email: string // 이메일
  password: string // 비밀번호
  class: mongoose.Types.ObjectId // 반 오브젝트 ID
  classNum: number // 출석번호

  admin: boolean // 관리자 여부
}

const schema = new mongoose.Schema<IUser>({
  name: {
    type: 'string',
    required: true,
  },
  admin: {
    type: 'boolean',
    default: false,
  },
  class: {
    type: 'ObjectId',
    ref: 'Class',
  },
})

export const User = mongoose.model<IUser>('User', schema, 'users')
