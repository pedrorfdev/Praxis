const { existsSync } = require('node:fs')
const { join } = require('node:path')

const candidates = [
  'dist/main.js',
  'dist/src/main.js',
  'dist/apps/api/src/main.js',
  'dist/apps/src/main.js',
]

const entrypoint = candidates.find((candidate) =>
  existsSync(join(process.cwd(), candidate)),
)

if (!entrypoint) {
  console.error('Could not find API production entrypoint. Tried:')
  for (const candidate of candidates) {
    console.error(`- ${candidate}`)
  }
  process.exit(1)
}

require(join(process.cwd(), entrypoint))
