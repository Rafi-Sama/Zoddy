import { useState, useEffect } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

interface ToastState {
  toasts: Toast[]
}

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(action: { type: 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST'; toast?: Toast; id?: string }) {
  switch (action.type) {
    case 'ADD_TOAST':
      memoryState = {
        ...memoryState,
        toasts: [action.toast!, ...memoryState.toasts].slice(0, 5)
      }
      break
    case 'UPDATE_TOAST':
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        )
      }
      break
    case 'DISMISS_TOAST':
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === action.id ? { ...t, open: false } : t
        )
      }
      break
    case 'REMOVE_TOAST':
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.filter((t) => t.id !== action.id)
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastOptions = Omit<Toast, 'id'>

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function toast(options: ToastOptions) {
  const id = genId()
  const toast = { ...options, id }

  dispatch({ type: 'ADD_TOAST', toast })

  setTimeout(() => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, 5000)

  return {
    id,
    dismiss: () => dispatch({ type: 'REMOVE_TOAST', id }),
    update: (props: ToastOptions) =>
      dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } })
  }
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id?: string) => dispatch({ type: 'REMOVE_TOAST', id })
  }
}