import mongoose, { InferSchemaType, Model } from 'mongoose'

import { APIClass, IClassMethods } from './Class'

export interface IUser {
  name: string // 이름
  email: string // 이메일
  password: string // 비밀번호
  class: mongoose.Types.ObjectId // 반 오브젝트 ID
  classNum: number // 출석번호

  admin: boolean // 관리자 여부
}

export interface APIUser {
  id: string
  name: string
  email: string
  class: APIClass
  classNum: number
}

export interface IUserMethods {
  toAPIUser(): Promise<APIUser>
}

const schema = new mongoose.Schema<IUser, Model<IUser>, IUserMethods>({
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
    required: true,
  },
  classNum: {
    type: 'number',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  password: {
    type: 'string',
    required: true,
  },
})

schema.methods.toAPIUser = async function () {
  const self = this as unknown as IUser & mongoose.Document

  if (self.class instanceof mongoose.Types.ObjectId) {
    await User.populate([self], 'class')
  }

  return {
    id: self._id.toString(),
    class: (self.class as unknown as IClassMethods).toAPIClass(),
    classNum: self.classNum,
    email: self.email,
    name: self.name,
  }
}

export const User = mongoose.model<IUser>('User', schema, 'users')
