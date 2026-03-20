'use client'

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(0) // 0 so first call runs immediately

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = Date.now()
      }
    }) as T,
    [callback, delay]
  )
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps)
}

export function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>(undefined)
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    setPrev(ref.current)
    ref.current = value
  }, [value])
  return prev
}

// Lazy loading components
export const LazyLoad = ({ children, fallback = null, rootMargin = '50px' }: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
}) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isIntersecting = useIntersectionObserver(ref, { rootMargin })

  useEffect(() => {
    if (isIntersecting) setHasBeenVisible(true)
  }, [isIntersecting])

  return (
    <div ref={ref}>
      {hasBeenVisible ? children : fallback}
    </div>
  )
}

// Lazy loading utility
export function lazyWithPreload<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const Component = React.lazy(importFunc)

  const preload = () => {
    importFunc()
  }

  return Object.assign(Component, { preload })
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

// Performance monitoring
export function usePerformanceMonitor(name: string) {
  const startTime = useRef<number | undefined>(undefined)

  useEffect(() => {
    startTime.current = performance.now()
    return () => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current
        console.log(`${name} render time: ${duration.toFixed(2)}ms`)
      }
    }
  })
}

