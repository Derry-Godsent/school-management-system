/**
 * Minimal class-name joiner. Stands in for clsx/tailwind-merge, which are not
 * dependencies of this project, we only ever need to concatenate truthy
 * strings here.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
