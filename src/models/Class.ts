import mongoose from 'mongoose'

export interface IClass {
  grade: number
  classNum: number
  classCode: string
}

const schema = new mongoose.Schema<IClass>({
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

export const Class = mongoose.model<IClass>('Class', schema, 'classes')
