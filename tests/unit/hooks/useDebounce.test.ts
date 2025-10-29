import { act } from '@testing-library/react'
import { renderHookWithProviders } from '@/test/test-utils'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce hook', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('debounces value changes based on delay', () => {
    const { result, rerender } = renderHookWithProviders(
      (props: { value: string; delay?: number }) => useDebounce(props.value, props.delay),
      { initialProps: { value: 'a', delay: 100 } }
    )

    expect(result.current).toBe('a')

    // change value and advance less than delay
    rerender({ value: 'b', delay: 100 })

    act(() => {
      vi.advanceTimersByTime(50)
    })

    // still old value
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(60)
    })

    // now debounced value updated
    expect(result.current).toBe('b')
  })
})
