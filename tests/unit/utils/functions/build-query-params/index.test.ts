import { describe, expect, it } from 'vitest'
import { buildQueryParams } from '@/utils/functions/build-query-params'

describe('buildQueryParams', () => {
  it('returns empty string for empty object', () => {
    expect(buildQueryParams({})).toBe('')
  })

  it('builds single param correctly', () => {
    expect(buildQueryParams({ a: 'x' })).toBe('?a=x')
  })

  it('builds multiple params preserving order', () => {
    expect(buildQueryParams({ a: 1, b: 'two' })).toBe('?a=1&b=two')
  })

  it('repeats array values as multiple params', () => {
    expect(buildQueryParams({ a: [1, 2, 'three'] })).toBe('?a=1&a=2&a=three')
  })

  it('returns question mark when arrays are empty (no pairs appended)', () => {
    // When array is empty, URLSearchParams will be empty and function will return '?'
    expect(buildQueryParams({ a: [] })).toBe('?')
  })
})
