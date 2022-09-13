import z from 'zod'
import { Class, User } from '~/models'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const refreshSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
})

export const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z
      .string()
      .email()
      // 이메일 사용 여부 체크
      .refine(async (v) => {
        const u = await User.findOne({ email: v })

        return !u
      }, '이 이메일은 이미 사용중입니다'),
    password: z.string().min(6),
    classNum: z.number().int().min(1).max(40), // 번호는 1번 - 40번까지 허용
    classCode: z.string().min(6).max(6),
  })
  .superRefine(async (val, ctx) => {
    const cl = await Class.findOne({ classCode: val.classCode })

    // 반 코드가 존재하는지 체크
    if (cl) {
      const u = await User.findOne({ class: cl._id, classNum: val.classNum })

      // 번호가 이미 사용되었는지 체크
      if (u) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['classNum'],
          message: '이미 사용된 출석 번호입니다',
        })
      }
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classCode'],
        message: '잘못된 반 코드입니다',
      })
    }
  })
