import { dirname, resolve } from 'node:path'

export interface DshCommand {
  readonly file: string
  readonly args: readonly string[]
  readonly cwd: string | undefined
  readonly viaShell: boolean
}

/**
 * Re-invoke the CLI that launched this host when possible, otherwise a PATH `dsh`.
 * Official docs: `dsh plugin --profile <name> add <target>` is the install entry.
 * Windows .cmd shims need a shell; documented community practice for plugin installers.
 */
export function resolveDshCommand(
  argv: readonly string[] = process.argv,
  execPath = process.execPath,
  execArgv: readonly string[] = process.execArgv,
  platform = process.platform,
): DshCommand {
  const entry = argv[1]
  if (entry && /(?:^|[/\\])(?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
    const abs = resolve(entry)
    return { file: execPath, args: [...execArgv, abs], cwd: dirname(abs), viaShell: false }
  }
  return { file: 'dsh', args: [], cwd: undefined, viaShell: platform === 'win32' }
}

export const TARGET_RE = /^(?:[A-Za-z0-9._+-]+\/)?[A-Za-z0-9@._+-]+(?:@[A-Za-z0-9._+-]+)?$|^github:[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+#[A-Za-z0-9._/-]+$/

export function assertSafeTarget(target: string): void {
  if (!TARGET_RE.test(target) || target.includes('@latest')) {
    throw new Error(`Refusing unsafe or unpinned plugin target: ${target}`)
  }
}
