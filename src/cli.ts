import chalk from 'chalk'
import 'dotenv/config'
import inquirer from 'inquirer'
import _ from 'lodash'
import mongoose from 'mongoose'
import yargs from 'yargs'

import { Class } from './models'

const codeChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

yargs()
  .command(
    'class create',
    '반을 생성합니다',
    (yargs) => yargs,
    async () => {
      const values = await inquirer.prompt<{ grade: number; classNum: number }>([
        {
          type: 'number',
          message: '학년을 입력해 주세요',
          name: 'grade',
          validate: (v) => !isNaN(v) && v > 0,
        },
        {
          type: 'number',
          message: '반을 입력해 주세요',
          name: 'classNum',
          validate: (v) => !isNaN(v) && v > 0,
        },
      ])

      await mongoose.connect(process.env.DB_DSN!)

      const cl = await Class.findOne({ grade: values.grade, classNum: values.classNum })

      if (cl) {
        console.error(chalk.red('반이 이미 존재합니다'))
        process.exit(1)
      }

      let code = ''

      console.log(chalk.blue('코드 생성 중...'))

      do {
        code = _.sampleSize(codeChars, 6).join('')
      } while (await Class.findOne({ classCode: code }))

      console.log(chalk.blue('반 생성 중...'))

      const clazz = new Class()

      clazz.grade = values.grade

      clazz.classNum = values.classNum

      clazz.classCode = code

      await clazz.save()

      console.log(
        chalk.green`반을 만들었어요!(${chalk.blue`${clazz.grade}학년 ${clazz.classNum}반`}) 반 코드: ${chalk.blue(
          code
        )}`
      )

      await mongoose.disconnect()
    }
  )
  .strictCommands()
  .demandCommand(1)
  .scriptName('yarn kwiki')
  .parse(process.argv.slice(2))
