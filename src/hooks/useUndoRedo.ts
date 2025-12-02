/**
 * useUndoRedo Hook
 * A custom React hook providing undo/redo functionality for any state value
 * Features:
 * - Automatic state history tracking
 * - Configurable history limit
 * - Type-safe undo/redo operations
 * - Keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
 * - Memory management with history size limits
 */

import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Configuration options for the useUndoRedo hook
 */
export interface UseUndoRedoOptions {
  /** Maximum number of undo states to keep (default: 50) */
  maxHistory?: number
  /** Enable keyboard shortcuts (default: true) */
  enableKeyboardShortcuts?: boolean
  /** Callback when undo/redo occurs */
  onChange?: (value: string, action: 'undo' | 'redo' | 'set') => void
}

/**
 * Undo/redo state management
 */
export interface UndoRedoState {
  /** Current value */
  value: string
  /** Stack of previous values */
  undoStack: string[]
  /** Stack of values that were undone */
  redoStack: string[]
  /** Whether undo is available */
  canUndo: boolean
  /** Whether redo is available */
  canRedo: boolean
  /** Number of items in undo stack */
  undoCount: number
  /** Number of items in redo stack */
  redoCount: number
}

/**
 * Undo/redo actions
 */
export interface UndoRedoActions {
  /** Set a new value and record in history */
  setValue: (value: string) => void
  /** Perform undo operation */
  undo: () => void
  /** Perform redo operation */
  redo: () => void
  /** Clear all history */
  clearHistory: () => void
  /** Get current state */
  getState: () => UndoRedoState
}

/**
 * Custom hook for managing undo/redo state
 * @param initialValue - The initial value for the state
 * @param options - Configuration options
 * @returns State and action methods
 */
export const useUndoRedo = (
  initialValue: string = '',
  options: UseUndoRedoOptions = {}
): UndoRedoState & UndoRedoActions => {
  const { maxHistory = 50, enableKeyboardShortcuts = true, onChangeCallback = undefined } = options

  // Internal state management
  const [state, setState] = useState({
    value: initialValue,
    undoStack: [] as string[],
    redoStack: [] as string[],
  })

  // Keep track of keyboard listeners for cleanup
  const keyboardListenerRef = useRef<((e: KeyboardEvent) => void) | null>(null)

  /**
   * Set value and update history
   */
  const setValue = useCallback(
    (newValue: string) => {
      setState(prevState => ({
        ...prevState,
        undoStack:
          prevState.value !== newValue && prevState.value !== ''
            ? [...prevState.undoStack, prevState.value].slice(-maxHistory)
            : prevState.undoStack,
        redoStack: [],
        value: newValue,
      }))
      onChangeCallback?.(newValue, 'set')
    },
    [maxHistory, onChangeCallback]
  )

  /**
   * Undo operation
   */
  const undo = useCallback(() => {
    setState(prevState => {
      if (prevState.undoStack.length === 0) return prevState

      const newUndoStack = [...prevState.undoStack]
      const previousValue = newUndoStack.pop()!

      onChangeCallback?.(previousValue, 'undo')

      return {
        ...prevState,
        value: previousValue,
        undoStack: newUndoStack,
        redoStack: [prevState.value, ...prevState.redoStack].slice(0, maxHistory),
      }
    })
  }, [maxHistory, onChangeCallback])

  /**
   * Redo operation
   */
  const redo = useCallback(() => {
    setState(prevState => {
      if (prevState.redoStack.length === 0) return prevState

      const newRedoStack = [...prevState.redoStack]
      const nextValue = newRedoStack.shift()!

      onChangeCallback?.(nextValue, 'redo')

      return {
        ...prevState,
        value: nextValue,
        undoStack: [...prevState.undoStack, prevState.value].slice(-maxHistory),
        redoStack: newRedoStack,
      }
    })
  }, [maxHistory, onChangeCallback])

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      undoStack: [],
      redoStack: [],
    }))
  }, [])

  /**
   * Get current state
   */
  const getState = useCallback((): UndoRedoState => {
    return {
      value: state.value,
      undoStack: state.undoStack,
      redoStack: state.redoStack,
      canUndo: state.undoStack.length > 0,
      canRedo: state.redoStack.length > 0,
      undoCount: state.undoStack.length,
      redoCount: state.redoStack.length,
    }
  }, [state])

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    keyboardListenerRef.current = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey

      // Ctrl+Z or Cmd+Z: Undo
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y: Redo
      if ((isCtrlOrCmd && e.key === 'z' && e.shiftKey) || (isCtrlOrCmd && e.key === 'y')) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', keyboardListenerRef.current)

    return () => {
      if (keyboardListenerRef.current) {
        window.removeEventListener('keydown', keyboardListenerRef.current)
      }
    }
  }, [enableKeyboardShortcuts, undo, redo])

  return {
    value: state.value,
    undoStack: state.undoStack,
    redoStack: state.redoStack,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
    undoCount: state.undoStack.length,
    redoCount: state.redoStack.length,
    setValue,
    undo,
    redo,
    clearHistory,
    getState,
  }
}

export default useUndoRedo
