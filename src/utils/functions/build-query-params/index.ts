export const buildQueryParams = <F extends Record<string, unknown>>(
  filters = {} as F
) => {
  if (!Object.keys(filters).length) return String()
  const searchParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      return value.forEach((value) => searchParams.append(key, String(value)))
    }
    return searchParams.append(key, String(value))
  })
  const query = '?'.concat(searchParams.toString())

  return query
}
