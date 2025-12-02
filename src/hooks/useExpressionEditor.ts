/**
 * useExpressionEditor Hook
 * A specialized hook for managing mathematical expression editing with undo/redo
 * Features:
 * - Expression state management with history
 * - Cursor position tracking
 * - Smart text insertion and deletion
 * - Copy/paste operations
 * - Expression validation hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useUndoRedo, UseUndoRedoOptions } from './useUndoRedo'

/**
 * Configuration for expression editor
 */
export interface UseExpressionEditorOptions extends UseUndoRedoOptions {
  /** Initial expression value */
  initialExpression?: string
  /** Callback when expression changes */
  onExpressionChange?: (expression: string) => void
  /** Callback for copy operation */
  onCopy?: (text: string) => void
  /** Callback for paste operation */
  onPaste?: (text: string) => void
  /** Validate expression before setting */
  validator?: (expression: string) => boolean
}

/**
 * Expression editor state
 */
export interface ExpressionEditorState {
  expression: string
  cursorPosition: number
  selectionStart: number
  selectionEnd: number
  isValid: boolean
  lastModifiedTime: number
}

/**
 * Expression editor actions
 */
export interface ExpressionEditorActions {
  /** Set the expression value */
  setExpression: (expression: string) => void
  /** Insert text at cursor position */
  insertText: (text: string) => void
  /** Delete text range */
  deleteText: (start: number, end: number) => void
  /** Replace text in range */
  replaceText: (start: number, end: number, replacement: string) => void
  /** Clear expression */
  clear: () => void
  /** Set cursor position */
  setCursorPosition: (position: number) => void
  /** Set selection range */
  setSelection: (start: number, end: number) => void
  /** Get selected text */
  getSelectedText: () => string
  /** Copy to clipboard */
  copy: () => Promise<void>
  /** Paste from clipboard */
  paste: () => Promise<void>
  /** Undo operation */
  undo: () => void
  /** Redo operation */
  redo: () => void
  /** Get current state */
  getState: () => ExpressionEditorState
}

/**
 * Custom hook for expression editor state management
 * @param options - Configuration options
 * @returns Expression state and action methods
 */
export const useExpressionEditor = (
  options: UseExpressionEditorOptions = {}
): ExpressionEditorState & ExpressionEditorActions => {
  const {
    initialExpression = '',
    onExpressionChange,
    onCopy,
    onPaste,
    validator,
    ...undoRedoOptions
  } = options

  // Undo/redo state
  const undoRedo = useUndoRedo(initialExpression, undoRedoOptions)

  // Editor state
  const [cursorPosition, setCursorPosition] = useState(initialExpression.length)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const [isValid, setIsValid] = useState(true)
  const [lastModifiedTime, setLastModifiedTime] = useState(Date.now())

  // Ref for input element
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  /**
   * Validate and set expression
   */
  const setExpression = useCallback(
    (expression: string) => {
      const valid = validator ? validator(expression) : true
      setIsValid(valid)
      if (valid) {
        undoRedo.setValue(expression)
        setCursorPosition(expression.length)
        setLastModifiedTime(Date.now())
        onExpressionChange?.(expression)
      }
    },
    [validator, undoRedo, onExpressionChange]
  )

  /**
   * Insert text at cursor position
   */
  const insertText = useCallback(
    (text: string) => {
      const newExpression =
        undoRedo.value.slice(0, cursorPosition) +
        text +
        undoRedo.value.slice(cursorPosition)

      setExpression(newExpression)
      setCursorPosition(cursorPosition + text.length)
    },
    [undoRedo.value, cursorPosition, setExpression]
  )

  /**
   * Delete text in range
   */
  const deleteText = useCallback(
    (start: number, end: number) => {
      const newExpression =
        undoRedo.value.slice(0, start) +
        undoRedo.value.slice(end)

      setExpression(newExpression)
      setCursorPosition(Math.max(0, start))
    },
    [undoRedo.value, setExpression]
  )

  /**
   * Replace text in range
   */
  const replaceText = useCallback(
    (start: number, end: number, replacement: string) => {
      const newExpression =
        undoRedo.value.slice(0, start) +
        replacement +
        undoRedo.value.slice(end)

      setExpression(newExpression)
      setCursorPosition(start + replacement.length)
    },
    [undoRedo.value, setExpression]
  )

  /**
   * Clear expression
   */
  const clear = useCallback(() => {
    setExpression('')
    setCursorPosition(0)
  }, [setExpression])

  /**
   * Get selected text
   */
  const getSelectedText = useCallback(() => {
    return undoRedo.value.slice(selectionStart, selectionEnd)
  }, [undoRedo.value, selectionStart, selectionEnd])

  /**
   * Copy to clipboard
   */
  const copy = useCallback(async () => {
    try {
      const textToCopy = selectionStart !== selectionEnd
        ? getSelectedText()
        : undoRedo.value

      await navigator.clipboard.writeText(textToCopy)
      onCopy?.(textToCopy)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [undoRedo.value, selectionStart, selectionEnd, getSelectedText, onCopy])

  /**
   * Paste from clipboard
   */
  const paste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()

      if (selectionStart !== selectionEnd) {
        // Replace selection
        replaceText(selectionStart, selectionEnd, text)
      } else {
        // Insert at cursor
        insertText(text)
      }

      onPaste?.(text)
    } catch (err) {
      console.error('Failed to paste from clipboard:', err)
    }
  }, [selectionStart, selectionEnd, replaceText, insertText, onPaste])

  /**
   * Undo operation
   */
  const undo = useCallback(() => {
    undoRedo.undo()
    setCursorPosition(undoRedo.undoStack.length > 0 ? undoRedo.undoStack[undoRedo.undoStack.length - 1].length : 0)
    setLastModifiedTime(Date.now())
    onExpressionChange?.(undoRedo.value)
  }, [undoRedo, onExpressionChange])

  /**
   * Redo operation
   */
  const redo = useCallback(() => {
    undoRedo.redo()
    setCursorPosition(undoRedo.redoStack.length > 0 ? undoRedo.redoStack[0].length : undoRedo.value.length)
    setLastModifiedTime(Date.now())
    onExpressionChange?.(undoRedo.value)
  }, [undoRedo, onExpressionChange])

  /**
   * Get current state
   */
  const getState = useCallback((): ExpressionEditorState => {
    return {
      expression: undoRedo.value,
      cursorPosition,
      selectionStart,
      selectionEnd,
      isValid,
      lastModifiedTime,
    }
  }, [undoRedo.value, cursorPosition, selectionStart, selectionEnd, isValid, lastModifiedTime])

  /**
   * Update input ref for cursor/selection management
   */
  const setInputRef = useCallback((ref: HTMLInputElement | HTMLTextAreaElement) => {
    inputRef.current = ref
  }, [])

  /**
   * Sync cursor position with input element
   */
  const syncCursorPosition = useCallback(() => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart ?? undoRedo.value.length)
      setSelectionStart(inputRef.current.selectionStart ?? 0)
      setSelectionEnd(inputRef.current.selectionEnd ?? 0)
    }
  }, [undoRedo.value.length])

  return {
    expression: undoRedo.value,
    cursorPosition,
    selectionStart,
    selectionEnd,
    isValid,
    lastModifiedTime,
    setExpression,
    insertText,
    deleteText,
    replaceText,
    clear,
    setCursorPosition: (pos: number) => {
      setCursorPosition(Math.max(0, Math.min(pos, undoRedo.value.length)))
    },
    setSelection: (start: number, end: number) => {
      setSelectionStart(Math.max(0, Math.min(start, undoRedo.value.length)))
      setSelectionEnd(Math.max(0, Math.min(end, undoRedo.value.length)))
    },
    getSelectedText,
    copy,
    paste,
    undo,
    redo,
    getState,
  }
}

export default useExpressionEditor
