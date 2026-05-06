// Performance monitoring utilities

interface PerformanceMark {
  name: string
  timestamp: number
}

class PerformanceMonitor {
  private marks: Map<string, PerformanceMark> = new Map()
  private enabled: boolean = process.env.NODE_ENV === 'development'

  mark(name: string) {
    if (!this.enabled) return

    this.marks.set(name, {
      name,
      timestamp: performance.now()
    })
  }

  measure(name: string, startMark: string, endMark?: string) {
    if (!this.enabled) return

    const start = this.marks.get(startMark)
    const end = endMark ? this.marks.get(endMark) : { timestamp: performance.now() }

    if (start && end) {
      const duration = end.timestamp - start.timestamp
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return duration
    }
  }

  clearMarks() {
    this.marks.clear()
  }
}

export const perfMonitor = new PerformanceMonitor()

// React component render tracker
export function trackComponentRender(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now()
    return () => {
      const endTime = performance.now()
      console.log(`[Render] ${componentName}: ${(endTime - startTime).toFixed(2)}ms`)
    }
  }
  return () => {}
}

// API call performance tracker
export async function trackApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await apiCall()
    const duration = performance.now() - start
    console.log(`[API] ${name}: ${duration.toFixed(2)}ms`)
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[API] ${name} failed: ${duration.toFixed(2)}ms`)
    throw error
  }
}

// Batch operation optimizer
export class BatchProcessor<T> {
  private queue: T[] = []
  private timer: NodeJS.Timeout | null = null
  private readonly batchSize: number
  private readonly delay: number
  private readonly processor: (batch: T[]) => void | Promise<void>

  constructor(
    processor: (batch: T[]) => void | Promise<void>,
    batchSize = 10,
    delay = 100
  ) {
    this.processor = processor
    this.batchSize = batchSize
    this.delay = delay
  }

  add(item: T) {
    this.queue.push(item)

    if (this.queue.length >= this.batchSize) {
      this.flush()
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.delay)
    }
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)
    await this.processor(batch)

    // Process remaining items if any
    if (this.queue.length > 0) {
      this.timer = setTimeout(() => this.flush(), this.delay)
    }
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.queue = []
  }
}