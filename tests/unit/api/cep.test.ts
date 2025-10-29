import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios')

import { fetchAddressByZip } from '@/api/cep'

// helper to create an AxiosResponse-shaped object for mocks
function makeResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: '',
    headers: {},
    config: {},
  } as unknown as import('axios').AxiosResponse<T>
}

describe('src/api/cep', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('returns null when via-cep signals erro', async () => {
    const spy = vi.spyOn(axios, 'get').mockResolvedValueOnce(
      makeResponse({ erro: true })
    )

    const res = await fetchAddressByZip('00000000')

    expect(res).toBeNull()
    expect(spy.mock.calls.length).toBeGreaterThan(0)
  })

  it('returns address when available', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce(
      makeResponse({ logradouro: 'Rua A', localidade: 'Cidade B' })
    )

    const res = await fetchAddressByZip('01001000')

    expect(res).toEqual({ addressLine: 'Rua A', city: 'Cidade B' })
  })

  it('returns undefined fields when via-cep has no address fields', async () => {
    vi.spyOn(axios, 'get').mockResolvedValueOnce(
      makeResponse<Record<string, unknown>>({})
    )

    const res = await fetchAddressByZip('99999999')

    expect(res).toEqual({ addressLine: undefined, city: undefined })
  })
})
