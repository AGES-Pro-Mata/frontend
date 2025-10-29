import { describe, expect, it } from 'vitest'
import { resolveImageUrl } from '@/utils/resolveImageUrl'

describe('resolveImageUrl', () => {
  const DEFAULT = '/logo-pro-mata.png'

  it('returns default for undefined and null', () => {
    expect(resolveImageUrl(undefined)).toBe(DEFAULT)
    expect(resolveImageUrl(null)).toBe(DEFAULT)
  })

  it('returns default for empty or whitespace-only strings', () => {
    expect(resolveImageUrl('')).toBe(DEFAULT)
    expect(resolveImageUrl('   ')).toBe(DEFAULT)
    expect(resolveImageUrl('./   ')).toBe(DEFAULT)
  })

  it('returns absolute HTTP/HTTPS URLs unchanged', () => {
    expect(resolveImageUrl('http://example.com/a.png')).toBe('http://example.com/a.png')
    expect(resolveImageUrl('HTTPS://example.com/b.png')).toBe('HTTPS://example.com/b.png')
  })

  it('returns data URLs unchanged', () => {
    const data = 'data:image/png;base64,iVBORw0KGgo='

    expect(resolveImageUrl(data)).toBe(data)
  })

  it('normalizes relative paths', () => {
    expect(resolveImageUrl('./image.png')).toBe('/image.png')
    expect(resolveImageUrl(' image.png ')).toBe('/image.png')
    expect(resolveImageUrl('/already/slash.png')).toBe('/already/slash.png')
  })

  it('handles weird relative parent path by preserving it and prefixing slash', () => {
    // ../ should not be stripped by normalizeRelativePath's regex, so it becomes '/../foo.png'
    expect(resolveImageUrl('../foo.png')).toBe('/../foo.png')
  })
})
