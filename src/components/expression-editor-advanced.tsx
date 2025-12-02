/**
 * Advanced Expression Editor Component
 * A feature-rich mathematical expression editor with undo/redo, syntax highlighting, and smart editing
 * Uses the custom useExpressionEditor hook for state management
 */

import React, { useRef, useEffect, useState } from 'react'
import { useExpressionEditor } from '@/hooks/useExpressionEditor'
import * as ExpressionUtils from '@/utils/expression-editor'

export interface AdvancedExpressionEditorProps {
  /** Initial expression value */
  initialValue?: string
  /** Callback when expression changes */
  onChange?: (expression: string) => void
  /** Read-only mode */
  readOnly?: boolean
  /** Show editor controls */
  showControls?: boolean
  /** Show character count */
  showStats?: boolean
  /** Enable syntax highlighting */
  enableSyntaxHighlight?: boolean
  /** Enable smart insertion (operators, functions, etc.) */
  enableSmartInsertion?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Custom CSS class */
  className?: string
  /** Auto-expand textarea */
  autoExpand?: boolean
  /** Validate expression */
  validator?: (expression: string) => boolean
}

/**
 * Syntax highlighting token type
 */
interface SyntaxToken {
  type: 'number' | 'operator' | 'function' | 'parenthesis' | 'constant' | 'text'
  text: string
  position: number
}

/**
 * Advanced Expression Editor Component
 */
export const AdvancedExpressionEditor: React.FC<AdvancedExpressionEditorProps> = ({
  initialValue = '',
  onChange,
  readOnly = false,
  showControls = true,
  showStats = true,
  enableSyntaxHighlight = true,
  enableSmartInsertion = true,
  placeholder = 'Enter expression...',
  className = '',
  autoExpand = true,
  validator,
}) => {
  const editor = useExpressionEditor({
    initialExpression: initialValue,
    onExpressionChange: onChange,
    validator,
  })

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [highlightTokens, setHighlightTokens] = useState<SyntaxToken[]>([])
  const [isFocused, setIsFocused] = useState(false)

  /**
   * Generate syntax highlight tokens
   */
  const generateSyntaxTokens = (expression: string): SyntaxToken[] => {
    if (!enableSyntaxHighlight) return []

    const tokens: SyntaxToken[] = []
    const functions = [
      'sin',
      'cos',
      'tan',
      'asin',
      'acos',
      'atan',
      'sinh',
      'cosh',
      'tanh',
      'log',
      'ln',
      'log2',
      'exp',
      'sqrt',
      'abs',
      'floor',
      'ceil',
      'round',
      'min',
      'max',
    ]
    const constants = ['π', 'pi', 'e', 'φ', 'phi', 'c', 'h', 'k', 'G']

    let i = 0
    while (i < expression.length) {
      const char = expression[i]

      // Numbers
      if (/\d/.test(char)) {
        let numStr = ''
        const startPos = i
        while (i < expression.length && /[\d.]/.test(expression[i])) {
          numStr += expression[i]
          i++
        }
        tokens.push({ type: 'number', text: numStr, position: startPos })
        continue
      }

      // Operators
      if (/[+\-*/^%]/.test(char)) {
        tokens.push({ type: 'operator', text: char, position: i })
        i++
        continue
      }

      // Parentheses
      if (/[()[\]{}]/.test(char)) {
        tokens.push({ type: 'parenthesis', text: char, position: i })
        i++
        continue
      }

      // Functions and constants
      if (/[a-zA-Z]/.test(char)) {
        let word = ''
        const startPos = i
        while (i < expression.length && /[a-zA-Z]/.test(expression[i])) {
          word += expression[i]
          i++
        }

        if (functions.includes(word)) {
          tokens.push({ type: 'function', text: word, position: startPos })
        } else if (constants.includes(word)) {
          tokens.push({ type: 'constant', text: word, position: startPos })
        } else {
          tokens.push({ type: 'text', text: word, position: startPos })
        }
        continue
      }

      // Whitespace and other characters
      i++
    }

    return tokens
  }

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value
    editor.setExpression(newValue)
    setHighlightTokens(generateSyntaxTokens(newValue))
  }

  /**
   * Handle key down for smart insertion
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return

    // Undo/Redo shortcuts
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey

    if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      editor.undo()
      return
    }

    if ((isCtrlOrCmd && e.key === 'z' && e.shiftKey) || (isCtrlOrCmd && e.key === 'y')) {
      e.preventDefault()
      editor.redo()
      return
    }

    // Smart insertion for operators
    if (enableSmartInsertion && /[+\-*/^]/.test(e.key) && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const { expression, cursorPos } = ExpressionUtils.insertOperator(
        editor.expression,
        e.key,
        editor.cursorPosition
      )
      editor.setExpression(expression)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPos
          inputRef.current.selectionEnd = cursorPos
        }
      }, 0)
      return
    }

    // Smart parentheses insertion
    if (enableSmartInsertion && e.key === '(') {
      e.preventDefault()
      const { expression, cursorPos } = ExpressionUtils.insertParentheses(
        editor.expression,
        editor.cursorPosition
      )
      editor.setExpression(expression)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPos
          inputRef.current.selectionEnd = cursorPos
        }
      }, 0)
      return
    }

    // Copy/Paste shortcuts
    if ((isCtrlOrCmd && e.key === 'c') || (isCtrlOrCmd && e.key === 'v')) {
      // Let browser handle default behavior
      return
    }

    // Clear on Escape
    if (e.key === 'Escape') {
      e.preventDefault()
      editor.clear()
      return
    }
  }

  /**
   * Handle focus/blur
   */
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  /**
   * Auto-expand textarea
   */
  useEffect(() => {
    if (autoExpand && inputRef.current) {
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      inputRef.current.style.height = `${Math.min(scrollHeight, 200)}px`
    }
  }, [editor.expression, autoExpand])

  /**
   * Sync cursor position with textarea
   */
  const handleSelection = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    editor.setSelection(target.selectionStart, target.selectionEnd)
  }

  return (
    <div
      className={`w-full rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-md border border-indigo-100 dark:border-gray-700 ${className}`}
    >
      {/* Header with controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-200 dark:border-gray-600">
          {/* Label */}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Expression Editor
          </span>

          {/* Control buttons */}
          <div className="flex gap-2 items-center">
            {/* Undo button */}
            <button
              onClick={editor.undo}
              disabled={editor.undoCount === 0}
              className={`p-2 rounded-md transition-colors ${
                editor.undoCount === 0
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
              onClick={editor.redo}
              disabled={editor.redoCount === 0}
              className={`p-2 rounded-md transition-colors ${
                editor.redoCount === 0
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
              onClick={editor.copy}
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
                onClick={editor.paste}
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
                onClick={editor.clear}
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

      {/* Expression editor area */}
      <div className="p-6">
        <textarea
          ref={inputRef}
          value={editor.expression}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSelect={handleSelection}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full font-mono text-lg text-gray-900 dark:text-white bg-transparent outline-none focus:outline-none p-0 placeholder-gray-400 disabled:opacity-60 resize-none overflow-y-auto ${
            !editor.isValid ? 'text-red-600 dark:text-red-400' : ''
          }`}
          aria-label="Mathematical expression"
          aria-multiline="true"
          rows={3}
        />
      </div>

      {/* Metadata footer */}
      {showStats && (
        <div className="text-xs text-gray-500 dark:text-gray-500 px-6 py-3 border-t border-indigo-200 dark:border-gray-600 flex items-center justify-between">
          <div className="space-x-2">
            <span>{editor.expression.length} characters</span>
            {!editor.isValid && (
              <>
                <span>•</span>
                <span className="text-red-600 dark:text-red-400">Invalid expression</span>
              </>
            )}
          </div>
          <div className="space-x-2">
            {editor.undoCount > 0 && (
              <span className="text-gray-400">
                {editor.undoCount} undo {editor.redoCount > 0 && `, ${editor.redoCount} redo`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedExpressionEditor
