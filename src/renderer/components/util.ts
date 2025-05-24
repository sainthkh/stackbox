import { FilePath } from '../../types'

export const getPaddingLeft = (level: number) => {
  return `calc(var(--spacing)*${3 + 2 * level})`;
}

export const filePathEquals = (a: FilePath, b: FilePath): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
