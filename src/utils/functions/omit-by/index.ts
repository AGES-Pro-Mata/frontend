type AnyObject = Record<string, unknown>

export const omitBy = <T extends AnyObject>(
  obj: T,
  predicate: (value: unknown, key: keyof T) => boolean
): T => {
  const initialValue = {} as T
  return Object.keys(obj).reduce<T>((result, key: keyof T) => {
    if (!predicate(obj[key], key)) {
      result[key] = obj[key]
    }
    return result
  }, initialValue)
}
