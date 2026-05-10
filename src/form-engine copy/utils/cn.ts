/**
 * Lightweight class-name merger for internal library use.
 * Accepts any mix of strings, undefined, null, or false — filters and joins.
 *
 * Consumers who need tailwind-merge conflict resolution should wrap this
 * with tailwind-merge in their own adapter implementations.
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}
