import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '../../../src/lib/countries'

describe('COUNTRIES list', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(COUNTRIES)).toBe(true)
    expect(COUNTRIES.length).toBeGreaterThan(0)
    for (const c of COUNTRIES) {
      expect(typeof c).toBe('string')
      expect(c.length).toBeGreaterThan(0)
    }
  })

  it('contains expected countries', () => {
    // A few representative countries that should be in the list
    expect(COUNTRIES).toContain('Brazil')
    expect(COUNTRIES).toContain('United States')
    expect(COUNTRIES).toContain('Canada')
  })

  it('exports the same reference when re-imported', async () => {
    // Ensure module export is stable across dynamic re-imports
    const mod = await import('../../../src/lib/countries')

    expect(mod.COUNTRIES).toBe(COUNTRIES)
  })
})
