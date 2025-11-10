export function trimLeading(str: string): string {
  const spaceToTrim = str.replace(/^\n+/, '').match(/^\s*/)?.[0];
  return str.replace(new RegExp(`^${spaceToTrim}`, 'gm'), '').trim();
}

/** A string template function to trim leading spaces off of indented string templates */
export function eol(strings: TemplateStringsArray, ...args: unknown[]): string {
  return trimLeading(String.raw(strings, ...args));
}