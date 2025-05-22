export const getPaddingLeft = (level: number) => {
  return `calc(var(--spacing)*${3 + 2 * level})`;
}
