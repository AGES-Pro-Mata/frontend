import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/core/api', () => ({ api: { patch: vi.fn() } }))

import { type ProfessorApprovalRequestPayload, approveOrRejectProfessor } from '@/api/professor'
import { api } from '@/core/api'

// helper to produce an AxiosResponse-shaped value for mocks
function makeResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: '',
    headers: {},
    config: {},
  } as unknown as import('axios').AxiosResponse<T>
}

describe('src/api/professor', () => {
  beforeEach(() => {
    // clear any spies/mocks
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('returns success response when api.patch resolves', async () => {
    vi.spyOn(api, 'patch').mockResolvedValueOnce(makeResponse({ ok: true }, 200))

    const payload: ProfessorApprovalRequestPayload = { userType: 'PROFESSOR' }

    const res = await approveOrRejectProfessor('id', payload)

    expect(res.statusCode).toBe(200)
    expect(res.message).toContain('Operação')
    expect(res.data).toEqual({ ok: true })
  })

  it('returns error info when api.patch rejects with response', async () => {
    const err = { response: { status: 400, data: { message: 'bad' } } }

    vi.spyOn(api, 'patch').mockRejectedValueOnce(err)

    const payload: ProfessorApprovalRequestPayload = { userType: 'PROFESSOR' }

    const res = await approveOrRejectProfessor('id', payload)

    expect(res.statusCode).toBe(400)
    expect(res.message).toBe('bad')
  })

  it('returns default error when api.patch rejects without response', async () => {
    vi.spyOn(api, 'patch').mockRejectedValueOnce(new Error('network'))

    const payload: ProfessorApprovalRequestPayload = { userType: 'PROFESSOR' }

    const res = await approveOrRejectProfessor('id', payload)

    expect(res.statusCode).toBe(500)
    expect(res.message).toContain('Erro ao processar')
  })
})
