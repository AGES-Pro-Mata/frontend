import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/core/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }))
vi.mock('@/types/experience', () => ({
  mapExperienceApiResponseToDTO: (r: unknown) => ({ mapped: true, ...(r as Record<string, unknown>) }),
  ExperienceCategory: {},
}))

import { api } from '@/core/api'
import { type CreateExperiencePayload, type FilterExperiencesParams, type SearchExperienceParams, createExperience, getExperiences, getExperiencesByFilter } from '@/api/experience'

// small helper so mocked api returns satisfy AxiosResponse typing
function makeResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: '',
    headers: {},
    config: {},
  } as unknown as import('axios').AxiosResponse<T>
}

describe('src/api/experience', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('createExperience calls api.post and returns response', async () => {
  const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce(makeResponse({ id: 'x' }, 201))

  const payload = {} as unknown as CreateExperiencePayload

  const res = await createExperience(payload)

  // ensure api.post was called
  expect(postSpy.mock.calls.length).toBeGreaterThan(0)
  // the wrapper returns the full axios response - assert status
  expect((res as unknown as import('axios').AxiosResponse).status).toBe(201)
  })

  it('getExperiences maps api response', async () => {
  vi.spyOn(api, 'get').mockResolvedValueOnce(makeResponse([{ id: '1', name: 'a' }], 200))

  const res = await getExperiences({} as unknown as SearchExperienceParams)

  expect(Array.isArray(res)).toBe(true)
  expect((res[0] as unknown as Record<string, unknown>)).toHaveProperty('mapped', true)
  })

  it('getExperiencesByFilter returns pagination-shaped object', async () => {
  const payload = { items: [{ id: 'i' }], page: 1, limit: 10, total: 100 }

  vi.spyOn(api, 'get').mockResolvedValueOnce(makeResponse(payload, 200))

  const res = await getExperiencesByFilter({} as unknown as FilterExperiencesParams & { page?: number; limit?: number })

  expect(res.items.length).toBe(1)
  expect(res.total).toBe(100)
  })
})
