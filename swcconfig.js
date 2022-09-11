import { writeFile } from 'fs/promises'
import { convert } from 'tsconfig-to-swcconfig'

await writeFile(
  '.swcrc',
  JSON.stringify(
    convert('tsconfig.json', process.cwd(), {
      minify: true,
    })
  )
)
