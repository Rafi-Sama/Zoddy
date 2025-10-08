// Safe localStorage wrapper with error handling and type safety

interface StorageOptions {
  expiresIn?: number // Expiration time in milliseconds
  encrypt?: boolean // Whether to encrypt the data (implement encryption as needed)
}

class LocalStorageManager {
  protected prefix = 'zoddy_'

  protected getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : null
      }

      const serialized = JSON.stringify(data)
      localStorage.setItem(this.getKey(key), serialized)
      return true
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error)
      return false
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))

      if (!item) {
        return defaultValue ?? null
      }

      const data = JSON.parse(item)

      // Check if expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key)
        return defaultValue ?? null
      }

      return data.value as T
    } catch (error) {
      console.error(`Failed to read from localStorage: ${key}`, error)
      return defaultValue ?? null
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error(`Failed to remove from localStorage: ${key}`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      // Only clear items with our prefix
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear localStorage', error)
      return false
    }
  }

  // Check if localStorage is available
  isAvailable(): boolean {
    try {
      const testKey = '__test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  // Get storage size in bytes
  getSize(): number {
    try {
      let size = 0
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key)
          if (item) {
            size += item.length + key.length
          }
        }
      })
      return size
    } catch {
      return 0
    }
  }

  // Clean expired items
  cleanExpired(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const data = JSON.parse(item)
              if (data.expiresAt && Date.now() > data.expiresAt) {
                localStorage.removeItem(key)
              }
            } catch {
              // Invalid data, remove it
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (error) {
      console.error('Failed to clean expired items', error)
    }
  }
}

// Session storage manager with same interface
class SessionStorageManager extends LocalStorageManager {
  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : null
      }

      const serialized = JSON.stringify(data)
      sessionStorage.setItem(this.getKey(key), serialized)
      return true
    } catch (error) {
      console.error(`Failed to save to sessionStorage: ${key}`, error)
      return false
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key))

      if (!item) {
        return defaultValue ?? null
      }

      const data = JSON.parse(item)

      // Check if expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key)
        return defaultValue ?? null
      }

      return data.value as T
    } catch (error) {
      console.error(`Failed to read from sessionStorage: ${key}`, error)
      return defaultValue ?? null
    }
  }

  remove(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error(`Failed to remove from sessionStorage: ${key}`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear sessionStorage', error)
      return false
    }
  }

  isAvailable(): boolean {
    try {
      const testKey = '__test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

export const storage = new LocalStorageManager()
export const sessionStore = new SessionStorageManager()

// Memory storage fallback for SSR or when localStorage is not available
class MemoryStorage {
  private store = new Map<string, unknown>()

  set<T>(key: string, value: T): boolean {
    this.store.set(key, value)
    return true
  }

  get<T>(key: string, defaultValue?: T): T | null {
    const value = this.store.get(key)
    if (value !== undefined) {
      return value as T
    }
    return defaultValue ?? null
  }

  remove(key: string): boolean {
    return this.store.delete(key)
  }

  clear(): boolean {
    this.store.clear()
    return true
  }

  isAvailable(): boolean {
    return true
  }
}

export const memoryStorage = new MemoryStorage()

// Get appropriate storage based on availability
export function getStorage() {
  if (typeof window !== 'undefined' && storage.isAvailable()) {
    return storage
  }
  return memoryStorage
}