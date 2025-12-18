/**
 * Simple nunjucks filter to map an array by returning the specified property. It returns the value of the specified
 * property name; it does not support passing a mapping function to be evaluated on each iteration.
 */
export default function mapPropertyFromArrayFilter(array: unknown[], property: string) {
  return (array as never[]).map(item => item[property])
}
