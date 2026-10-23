import { registerHooks } from 'node:module'
import { extname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (error.code !== 'ERR_MODULE_NOT_FOUND' || !specifier.startsWith('.') || extname(specifier)) {
        throw error
      }
      return nextResolve(`${specifier}.ts`, context)
    }
  },
})

const script = process.argv[2]
if (!script) throw new Error('Usage: node scripts/run-ts.mjs <script.ts>')
await import(pathToFileURL(resolve(script)).href)
