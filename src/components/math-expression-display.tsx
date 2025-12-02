/**
 * Math Expression Display Component
 * Displays mathematical expressions with single-line and multi-line view modes
 * Features: Expression rendering, history support, copy/paste, undo/redo, smart cursor management
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'

export type ViewMode = 'single-line' | 'multi-line'

export interface MathExpressionDisplayProps {
  /** Current expression value */
  value: string
  /** Callback when expression changes */
  onChange?: (value: string) => void
  /** View mode: single-line or multi-line */
  viewMode?: ViewMode
  /** Callback when view mode changes */
  onViewModeChange?: (mode: ViewMode) => void
  /** Enable read-only mode */
  readOnly?: boolean
  /** Placeholder text */
  placeholder?: string
  /** CSS class name for custom styling */
  className?: string
  /** Auto-expand multi-line input */
  autoExpand?: boolean
  /** Show editor controls (undo/redo/copy) */
  showControls?: boolean
  /** Expression history for undo/redo */
  history?: string[]
  /** Current history index */
  historyIndex?: number
  /** Callback for history navigation */
  onHistoryChange?: (index: number, value: string) => void
}

/**
 * Internal state for expression editing
 */
interface ExpressionState {
  value: string
  cursorPosition: number
  undoStack: string[]
  redoStack: string[]
}

/**
 * Math Expression Display Component
 * Supports both single-line and multi-line expression rendering
 */
export const MathExpressionDisplay: React.FC<MathExpressionDisplayProps> = ({
  value = '0',
  onChange,
  viewMode = 'single-line',
  onViewModeChange,
  readOnly = false,
  placeholder = '0',
  className = '',
  autoExpand = true,
  showControls = true,
  history = [],
  historyIndex = -1,
  onHistoryChange,
}) => {
  const [currentMode, setCurrentMode] = useState<ViewMode>(viewMode)
  const [state, setState] = useState<ExpressionState>({
    value,
    cursorPosition: value.length,
    undoStack: [],
    redoStack: [],
  })
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync external value changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      value,
      cursorPosition: value.length,
    }))
  }, [value])

  // Sync view mode changes
  useEffect(() => {
    setCurrentMode(viewMode)
  }, [viewMode])

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (newValue: string, newCursorPos?: number) => {
      const oldValue = state.value

      setState(prev => ({
        ...prev,
        value: newValue,
        cursorPosition: newCursorPos ?? newValue.length,
        undoStack:
          oldValue !== newValue && oldValue !== ''
            ? [...prev.undoStack, oldValue]
            : prev.undoStack,
        redoStack: [],
      }))

      onChange?.(newValue)
    },
    [state.value, onChange]
  )

  /**
   * Handle input field change event
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.currentTarget.value
    handleChange(newValue, e.currentTarget.selectionStart ?? newValue.length)
  }

  /**
   * Undo last change
   */
  const handleUndo = useCallback(() => {
    if (state.undoStack.length === 0) return

    const newUndoStack = [...state.undoStack]
    const previousValue = newUndoStack.pop()!

    setState(prev => ({
      ...prev,
      value: previousValue,
      cursorPosition: previousValue.length,
      undoStack: newUndoStack,
      redoStack: [prev.value, ...prev.redoStack],
    }))

    onChange?.(previousValue)
  }, [state.undoStack, onChange])

  /**
   * Redo last undone change
   */
  const handleRedo = useCallback(() => {
    if (state.redoStack.length === 0) return

    const newRedoStack = [...state.redoStack]
    const nextValue = newRedoStack.shift()!

    setState(prev => ({
      ...prev,
      value: nextValue,
      cursorPosition: nextValue.length,
      undoStack: [...prev.undoStack, prev.value],
      redoStack: newRedoStack,
    }))

    onChange?.(nextValue)
  }, [state.redoStack, onChange])

  /**
   * Copy expression to clipboard
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.value)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [state.value])

  /**
   * Paste from clipboard
   */
  const handlePaste = useCallback(async () => {
    if (readOnly) return
    try {
      const text = await navigator.clipboard.readText()
      handleChange(text, text.length)
      if (currentMode === 'single-line') {
        inputRef.current?.focus()
      } else {
        textareaRef.current?.focus()
      }
    } catch (err) {
      console.error('Failed to paste from clipboard:', err)
    }
  }, [readOnly, handleChange, currentMode])

  /**
   * Toggle view mode
   */
  const handleToggleViewMode = useCallback(() => {
    const newMode: ViewMode = currentMode === 'single-line' ? 'multi-line' : 'single-line'
    setCurrentMode(newMode)
    onViewModeChange?.(newMode)

    // Focus the new input element
    setTimeout(() => {
      if (newMode === 'single-line') {
        inputRef.current?.focus()
      } else {
        textareaRef.current?.focus()
      }
    }, 0)
  }, [currentMode, onViewModeChange])

  /**
   * Clear the expression
   */
  const handleClear = useCallback(() => {
    if (readOnly) return
    handleChange('', 0)
  }, [readOnly, handleChange])

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
        return
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault()
        handleRedo()
        return
      }

      // Ctrl/Cmd + C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        handleCopy()
        return
      }

      // Ctrl/Cmd + V: Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !readOnly) {
        e.preventDefault()
        handlePaste()
        return
      }

      // Escape: Clear
      if (e.key === 'Escape' && !readOnly) {
        e.preventDefault()
        handleClear()
        return
      }
    },
    [handleUndo, handleRedo, handleCopy, handlePaste, handleClear, readOnly]
  )

  /**
   * Auto-expand textarea height in multi-line mode
   */
  useEffect(() => {
    if (currentMode === 'multi-line' && textareaRef.current && autoExpand) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`
    }
  }, [state.value, currentMode, autoExpand])

  return (
    <div
      className={`w-full rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-md border border-indigo-100 dark:border-gray-700 ${className}`}
    >
      {/* Header with controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-200 dark:border-gray-600">
          {/* Label */}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Expression
          </span>

          {/* Control buttons */}
          <div className="flex gap-2 items-center">
            {/* View mode toggle */}
            <button
              onClick={handleToggleViewMode}
              className={`p-2 rounded-md transition-colors ${
                isFocused
                  ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={`Switch to ${currentMode === 'single-line' ? 'multi-line' : 'single-line'} mode`}
              aria-label="Toggle view mode"
            >
              {currentMode === 'single-line' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                </svg>
              )}
            </button>

            {/* Undo button */}
            <button
              onClick={handleUndo}
              disabled={state.undoStack.length === 0}
              className={`p-2 rounded-md transition-colors ${
                state.undoStack.length === 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999a11.954 11.954 0 0010.347 5.795c.256 0 .512-.006.766-.018v3.018c0 .196.114.378.299.46a.475.475 0 00.576-.08l3.85-3.85a.476.476 0 000-.666L14.988 5.5a.475.475 0 00-.576-.08.474.474 0 00-.299.46v3.018a10.002 10.002 0 00-9.347-5.899c-.9 0-1.784.119-2.64.354L2.166 4.999z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Redo button */}
            <button
              onClick={handleRedo}
              disabled={state.redoStack.length === 0}
              className={`p-2 rounded-md transition-colors ${
                state.redoStack.length === 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.834 4.999a11.954 11.954 0 00-10.347 5.795c-.256 0-.512-.006-.766-.018v3.018c0 .196-.114.378-.299.46a.475.475 0 01-.576-.08l-3.85-3.85a.476.476 0 010-.666l3.85-3.85a.475.475 0 01.576-.08.474.474 0 01.299.46v3.018a10.002 10.002 0 019.347-5.899c.9 0 1.784.119 2.64.354l-.524-1.559z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Copy (Ctrl+C)"
              aria-label="Copy"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4V3z" />
              </svg>
            </button>

            {/* Paste button */}
            {!readOnly && (
              <button
                onClick={handlePaste}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Paste (Ctrl+V)"
                aria-label="Paste"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
              </button>
            )}

            {/* Clear button */}
            {!readOnly && (
              <button
                onClick={handleClear}
                className="p-2 rounded-md bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900/50 transition-colors"
                title="Clear (Esc)"
                aria-label="Clear"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expression input area */}
      <div className="p-6">
        {currentMode === 'single-line' ? (
          /* Single-line input */
          <input
            ref={inputRef}
            type="text"
            value={state.value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly={readOnly}
            placeholder={placeholder}
            className="w-full text-4xl font-bold text-gray-900 dark:text-white text-right bg-transparent outline-none focus:outline-none p-0 placeholder-gray-400 disabled:opacity-60"
            aria-label="Math expression"
            aria-multiline="false"
          />
        ) : (
          /* Multi-line input */
          <textarea
            ref={textareaRef}
            value={state.value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly={readOnly}
            placeholder={placeholder}
            className="w-full font-mono text-lg text-gray-900 dark:text-white bg-transparent outline-none focus:outline-none p-0 placeholder-gray-400 disabled:opacity-60 resize-none overflow-y-auto"
            aria-label="Math expression"
            aria-multiline="true"
            rows={3}
          />
        )}
      </div>

      {/* Metadata footer */}
      <div className="text-xs text-gray-500 dark:text-gray-500 px-6 py-3 border-t border-indigo-200 dark:border-gray-600 flex items-center justify-between">
        <div className="space-x-2">
          <span>{currentMode === 'single-line' ? 'Single-line' : 'Multi-line'} mode</span>
          <span>•</span>
          <span>{state.value.length} characters</span>
        </div>
        {state.undoStack.length > 0 && (
          <span className="text-gray-400">
            {state.undoStack.length} undo, {state.redoStack.length} redo
          </span>
        )}
      </div>
    </div>
  )
}

export default MathExpressionDisplay
