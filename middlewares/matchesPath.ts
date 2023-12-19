export function matchesPath(pathname: string, pattern: string): boolean {
  if (pattern.includes(':path*')) {
    // 動態路徑
    const regex = new RegExp(`^${pattern.replace(':path*', '(.*)')}$`)
    return regex.test(pathname)
  } else {
    // 靜態路徑
    return pathname === pattern
  }
}