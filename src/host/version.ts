import { spawn } from 'node:child_process'
import { classifyHostLine, extractVersion } from '../shared/semver.ts'
import type { HostLine, HostVersionInfo } from '../shared/types.ts'
import { resolveDshCommand } from './dsh-command.ts'

export async function readHostVersion(override?: HostLine): Promise<HostVersionInfo> {
  if (override && override !== 'unknown') {
    return { raw: null, parsed: null, line: override, source: 'manual' }
  }
  const command = resolveDshCommand()
  try {
    const output = await runVersion(command)
    const parsed = extractVersion(output)
    return {
      raw: output.trim() || null,
      parsed,
      line: classifyHostLine(parsed),
      source: parsed ? 'dsh-version' : 'unavailable',
    }
  } catch {
    return { raw: null, parsed: null, line: 'unknown', source: 'unavailable' }
  }
}

function runVersion(command: ReturnType<typeof resolveDshCommand>): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command.file, [...command.args, '--version'], {
      cwd: command.cwd,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: command.viaShell,
    })
    let out = ''
    let err = ''
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      reject(new Error('dsh --version timed out'))
    }, 8_000)
    child.stdout.on('data', chunk => { out += String(chunk) })
    child.stderr.on('data', chunk => { err += String(chunk) })
    child.on('error', error => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', code => {
      clearTimeout(timer)
      const text = `${out}\n${err}`
      if (code === 0 || extractVersion(text)) resolvePromise(text)
      else reject(new Error(err || `dsh --version exited ${code ?? 'null'}`))
    })
  })
}
