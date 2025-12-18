/**
 * Simple nunjucks filter to dedupe the specified array.
 */
export default function dedupeArrayFilter(array: unknown[]) {
  return [...new Set(array)]
}
