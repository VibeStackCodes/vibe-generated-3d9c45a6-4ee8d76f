/**
 * Undo/Redo Integration Examples
 * Shows how to integrate the new undo/redo hooks with existing calculator components
 */

import React, { useState } from 'react'
import { useExpressionEditor } from '@/hooks'
import { AdvancedExpressionEditor } from '@/components'
import * as ExpressionUtils from '@/utils/expression-editor'

/**
 * Example 1: Simple Calculator with Undo/Redo
 * Demonstrates basic integration with calculation preview
 */
export const SimpleCalculatorWithUndoRedo: React.FC = () => {
  const editor = useExpressionEditor({
    initialExpression: '',
    validator: (expr) => ExpressionUtils.validateExpression(expr),
  })

  const [result, setResult] = useState<string>('')

  const handleCalculate = () => {
    try {
      // In a real app, use actual math evaluation
      const evaluated = eval(editor.expression)
      setResult(`${editor.expression} = ${evaluated}`)
    } catch (err) {
      setResult('Error: Invalid expression')
    }
  }

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold">Simple Calculator</h2>

      <AdvancedExpressionEditor
        initialValue={editor.expression}
        onChange={(expr) => editor.setExpression(expr)}
        showControls
        autoExpand
      />

      <button
        onClick={handleCalculate}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Calculate
      </button>

      {result && (
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-400">
          <p className="font-mono text-green-900 dark:text-green-100">{result}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Example 2: Advanced Calculator with History
 * Shows calculation history with undo/redo support
 */
export const AdvancedCalculatorWithHistory: React.FC = () => {
  const editor = useExpressionEditor({
    initialExpression: '',
    validator: (expr) => ExpressionUtils.validateExpression(expr),
  })

  const [history, setHistory] = useState<Array<{ expr: string; result: string }>>([])

  const handleCalculate = () => {
    try {
      const evaluated = eval(editor.expression)
      const newEntry = {
        expr: editor.expression,
        result: evaluated.toString(),
      }
      setHistory([newEntry, ...history])
      editor.clear()
    } catch (err) {
      // Show error
    }
  }

  const replayCalculation = (expr: string) => {
    editor.setExpression(expr)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Editor */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Calculator</h2>

        <AdvancedExpressionEditor
          initialValue={editor.expression}
          onChange={(expr) => editor.setExpression(expr)}
          showControls
          showStats
          autoExpand
        />

        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Calculate
        </button>
      </div>

      {/* History */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">History</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => replayCalculation(item.expr)}
              className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {item.expr}
              </p>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                = {item.result}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Example 3: Expression Builder with Smart Insertion
 * Demonstrates smart operator and function insertion
 */
export const ExpressionBuilderWithSmartInsertion: React.FC = () => {
  const editor = useExpressionEditor({
    initialExpression: '',
    validator: (expr) => ExpressionUtils.validateExpression(expr),
  })

  const insertFunction = (functionName: string) => {
    const { expression, cursorPos } = ExpressionUtils.insertFunction(
      editor.expression,
      functionName,
      editor.cursorPosition
    )
    editor.setExpression(expression)
    editor.setCursorPosition(cursorPos)
  }

  const insertOperator = (op: string) => {
    const { expression, cursorPos } = ExpressionUtils.insertOperator(
      editor.expression,
      op,
      editor.cursorPosition
    )
    editor.setExpression(expression)
    editor.setCursorPosition(cursorPos)
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Expression Builder</h2>

      <AdvancedExpressionEditor
        initialValue={editor.expression}
        onChange={(expr) => editor.setExpression(expr)}
        showControls
        showStats
        autoExpand
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Numbers */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => editor.insertText(num.toString())}
            className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg"
          >
            {num}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Operators */}
        {['+', '-', '*', '/'].map(op => (
          <button
            key={op}
            onClick={() => insertOperator(op)}
            className="p-2 bg-indigo-200 dark:bg-indigo-900 hover:bg-indigo-300 dark:hover:bg-indigo-800 rounded-lg font-semibold"
          >
            {op}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Functions */}
        {['sin', 'cos', 'tan', 'sqrt', 'abs', 'log', 'exp', 'floor'].map(func => (
          <button
            key={func}
            onClick={() => insertFunction(func)}
            className="p-2 bg-purple-200 dark:bg-purple-900 hover:bg-purple-300 dark:hover:bg-purple-800 rounded-lg text-sm font-semibold"
          >
            {func}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Special */}
        <button
          onClick={() => editor.insertText('π')}
          className="p-2 bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 dark:hover:bg-amber-800 rounded-lg"
        >
          π
        </button>
        <button
          onClick={() => editor.insertText('e')}
          className="p-2 bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 dark:hover:bg-amber-800 rounded-lg"
        >
          e
        </button>
        <button
          onClick={() => {
            const { expression, cursorPos } = ExpressionUtils.insertParentheses(
              editor.expression,
              editor.cursorPosition
            )
            editor.setExpression(expression)
            editor.setCursorPosition(cursorPos)
          }}
          className="p-2 bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 dark:hover:bg-amber-800 rounded-lg"
        >
          ( )
        </button>
      </div>
    </div>
  )
}

/**
 * Example 4: Multi-line Expression Editor with Undo/Redo
 * For complex expressions and calculations
 */
export const MultilineExpressionEditor: React.FC = () => {
  const editor = useExpressionEditor({
    initialExpression: 'x = 2 + 3\ny = sin(x)\nz = y * π',
    validator: (expr) => ExpressionUtils.validateExpression(expr),
  })

  const tokens = ExpressionUtils.tokenizeExpression(editor.expression)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Editor */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Multi-line Expression</h2>

        <AdvancedExpressionEditor
          initialValue={editor.expression}
          onChange={(expr) => editor.setExpression(expr)}
          showControls
          showStats
          autoExpand
        />
      </div>

      {/* Analysis */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Statistics</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Characters:</strong> {editor.expression.length}
            </p>
            <p>
              <strong>Lines:</strong> {editor.expression.split('\n').length}
            </p>
            <p>
              <strong>Tokens:</strong> {tokens.length}
            </p>
            <p>
              <strong>Valid:</strong> {editor.isValid ? '✓' : '✗'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tokens</h3>
          <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
            {tokens.map((token, idx) => (
              <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
                {token}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Undo/Redo</h3>
          <div className="space-y-1 text-sm">
            <p>Undo: {editor.undoCount} items</p>
            <p>Redo: {editor.redoCount} items</p>
            <p>Last modified: {new Date(editor.lastModifiedTime).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Example 5: Expression Validator and Formatter
 * Shows real-time validation and formatting
 */
export const ExpressionValidatorAndFormatter: React.FC = () => {
  const editor = useExpressionEditor({
    initialExpression: 'sin(x)+cos(y)',
    validator: (expr) => ExpressionUtils.validateExpression(expr),
  })

  const isValid = ExpressionUtils.validateExpression(editor.expression)
  const formatted = ExpressionUtils.formatExpression(editor.expression)
  const wordAtCursor = ExpressionUtils.getWordAtCursor(editor.expression, editor.cursorPosition)
  const inParens = ExpressionUtils.isCursorInParentheses(editor.expression, editor.cursorPosition)

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold">Expression Validator & Formatter</h2>

      <AdvancedExpressionEditor
        initialValue={editor.expression}
        onChange={(expr) => editor.setExpression(expr)}
        showControls
        showStats
        autoExpand
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Validation */}
        <div className={`p-4 rounded-lg border-2 ${isValid ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20'}`}>
          <h3 className="font-semibold mb-2">Validation</h3>
          <p className={`${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isValid ? '✓ Valid expression' : '✗ Invalid expression'}
          </p>
        </div>

        {/* Formatted */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-400">
          <h3 className="font-semibold mb-2">Formatted</h3>
          <p className="font-mono text-sm text-blue-600 dark:text-blue-400">{formatted}</p>
        </div>

        {/* Cursor Context */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-400">
          <h3 className="font-semibold mb-2">Cursor Context</h3>
          <p className="text-sm">
            Position: <strong>{editor.cursorPosition}</strong>
          </p>
          <p className="text-sm">
            Word: <strong>{wordAtCursor || '(none)'}</strong>
          </p>
          <p className="text-sm">
            In parentheses: <strong>{inParens ? 'Yes' : 'No'}</strong>
          </p>
        </div>

        {/* Statistics */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-400">
          <h3 className="font-semibold mb-2">Statistics</h3>
          <p className="text-sm">
            Length: <strong>{editor.expression.length}</strong> chars
          </p>
          <p className="text-sm">
            Undo: <strong>{editor.undoCount}</strong> | Redo: <strong>{editor.redoCount}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleCalculatorWithUndoRedo
