import mongoose from 'mongoose'

export interface IClass {
  grade: number
  classNum: number
  classCode: string
}

export interface IClassMethods {
  toAPIClass(): APIClass
}

export interface APIClass {
  id: string
  grade: number
  classNum: number
}

const schema = new mongoose.Schema<IClass, mongoose.Model<IClass>, IClassMethods>({
  classCode: {
    type: 'string',
    unique: true,
    required: true,
  },
  classNum: {
    type: 'number',
    required: true,
  },
  grade: {
    type: 'number',
    required: true,
  },
})

schema.methods.toAPIClass = function () {
  const self = this as unknown as IClass & mongoose.Document

  return {
    id: self._id.toString(),
    classNum: self.classNum,
    grade: self.grade,
  }
}

export const Class = mongoose.model<IClass>('Class', schema, 'classes')
