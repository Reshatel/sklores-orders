import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { FLIP_DURATION_MS, REDUCED_MOTION_QUERY } from '../config'

export function useFlipAnimation(listRef: RefObject<HTMLElement | null>, orderKey: string) {
  const previousTops = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-flip-key]'))
    const shouldAnimate = !window.matchMedia(REDUCED_MOTION_QUERY).matches
    const nextTops = new Map<string, number>()

    for (const item of items) {
      const key = item.dataset.flipKey ?? ''
      const top = item.offsetTop
      nextTops.set(key, top)

      const previousTop = previousTops.current.get(key)
      if (!shouldAnimate || previousTop === undefined || previousTop === top) continue

      item.animate([{ transform: `translateY(${previousTop - top}px)` }, { transform: 'translateY(0)' }], {
        duration: FLIP_DURATION_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      })
    }

    previousTops.current = nextTops
  }, [listRef, orderKey])
}
