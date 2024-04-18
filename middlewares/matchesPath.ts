export function matchesPath(pathname: string, pattern: string): boolean {
  if (pattern.includes(':path*')) {
    const regex = new RegExp(`^${pattern.replace(':path*', '(.*)')}$`)
    return regex.test(pathname)
  } else {
    return pathname === pattern
  }
}