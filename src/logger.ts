import { Logger } from 'tslog'

export const logger = new Logger({
  dateTimeTimezone: 'Asia/Seoul',
  displayFilePath: 'hidden',
  displayFunctionName: false,
  displayInstanceName: false,
  displayLoggerName: false,
  dateTimePattern: 'year/month/day hour:minute:second',
})
