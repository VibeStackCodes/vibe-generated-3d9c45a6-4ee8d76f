/**
 * Undo/Redo Functionality Demo Page
 * Showcases the useUndoRedo hook and useExpressionEditor hook with various examples
 */

import React, { useState } from 'react'
import { useUndoRedo, useExpressionEditor } from '@/hooks'
import { AdvancedExpressionEditor } from '@/components'
import * as ExpressionUtils from '@/utils/expression-editor'

/**
 * Undo/Redo Demo Page Component
 */
export const UndoRedoDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'utils'>('basic')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Undo/Redo Functionality</h1>
          <p className="text-indigo-200">
            Comprehensive demonstration of expression editor undo/redo state management
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 bg-indigo-900/50 rounded-lg p-4 backdrop-blur-sm border border-indigo-700">
          {['basic', 'advanced', 'utils'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-900/50'
              }`}
            >
              {tab === 'basic' && 'Basic Hook'}
              {tab === 'advanced' && 'Advanced Editor'}
              {tab === 'utils' && 'Expression Utils'}
            </button>
          ))}
        </div>

        {/* Basic useUndoRedo Hook Demo */}
        {activeTab === 'basic' && <BasicHookDemo />}

        {/* Advanced Expression Editor Demo */}
        {activeTab === 'advanced' && <AdvancedEditorDemo />}

        {/* Expression Utilities Demo */}
        {activeTab === 'utils' && <ExpressionUtilsDemo />}

        {/* Feature Overview */}
        <div className="bg-indigo-900 rounded-2xl shadow-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">Features Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">useUndoRedo Hook</h3>
                  <p className="text-indigo-200 text-sm">Generic undo/redo for any state value with configurable history limits</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">useExpressionEditor Hook</h3>
                  <p className="text-indigo-200 text-sm">Specialized hook for expression editing with cursor tracking and validation</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Keyboard Shortcuts</h3>
                  <p className="text-indigo-200 text-sm">Full keyboard support: Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+Y (redo)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Expression Utils</h3>
                  <p className="text-indigo-200 text-sm">Helper functions for smart text insertion, formatting, and validation</p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Copy/Paste Support</h3>
                  <p className="text-indigo-200 text-sm">Clipboard integration with selection support</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Cursor Management</h3>
                  <p className="text-indigo-200 text-sm">Smart cursor positioning and selection tracking</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Smart Insertion</h3>
                  <p className="text-indigo-200 text-sm">Automatic operator spacing and function syntax</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Type Safety</h3>
                  <p className="text-indigo-200 text-sm">Full TypeScript support with strict type checking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-indigo-200 text-sm">
          <p>Undo/Redo Demo • Part of Keystone Calc</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Basic Hook Demo Component
 */
const BasicHookDemo: React.FC = () => {
  const undoRedo = useUndoRedo('', {
    maxHistory: 20,
    enableKeyboardShortcuts: true,
  })

  const handleAddText = (text: string) => {
    undoRedo.setValue(undoRedo.value + text)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic useUndoRedo Hook</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Simple demonstration of the useUndoRedo hook with text accumulation
        </p>
      </div>

      {/* Display area */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 min-h-24 text-lg font-mono text-gray-900 dark:text-white break-words">
        {undoRedo.value || '(empty)'}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Hello', 'World', '123', '!!!'].map(text => (
          <button
            key={text}
            onClick={() => handleAddText(text)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Add {text}
          </button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={undoRedo.undo}
          disabled={undoRedo.undoCount === 0}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            undoRedo.undoCount === 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Undo ({undoRedo.undoCount})
        </button>

        <button
          onClick={undoRedo.redo}
          disabled={undoRedo.redoCount === 0}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            undoRedo.redoCount === 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Redo ({undoRedo.redoCount})
        </button>

        <button
          onClick={undoRedo.clearHistory}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Clear
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>Current value: {undoRedo.value.length} characters</p>
        <p>Undo stack: {undoRedo.undoCount} items • Redo stack: {undoRedo.redoCount} items</p>
        <p>Try using Ctrl+Z to undo and Ctrl+Shift+Z to redo</p>
      </div>
    </div>
  )
}

/**
 * Advanced Expression Editor Demo Component
 */
const AdvancedEditorDemo: React.FC = () => {
  const [expression, setExpression] = useState('sin(π/2)')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Expression Editor</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Full-featured expression editor with undo/redo, smart insertion, and copy/paste
        </p>
      </div>

      <AdvancedExpressionEditor
        initialValue={expression}
        onChange={setExpression}
        showControls
        showStats
        enableSyntaxHighlight
        enableSmartInsertion
        placeholder="Enter mathematical expression..."
        autoExpand
      />

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          <strong>Features:</strong> Undo/Redo, Copy/Paste, Smart operators, Syntax highlighting
        </p>
        <p>
          <strong>Try:</strong>
          <br />• Type operators (+, -, *, /) for automatic spacing
          <br />• Use Ctrl+Z to undo and Ctrl+Y to redo
          <br />• Press ( for automatic parentheses pairing
          <br />• Escape clears the expression
        </p>
      </div>
    </div>
  )
}

/**
 * Expression Utilities Demo Component
 */
const ExpressionUtilsDemo: React.FC = () => {
  const [result, setResult] = useState<string>('')

  const runUtil = (name: string, expression: string) => {
    let res = ''
    switch (name) {
      case 'validate':
        res = `Valid: ${ExpressionUtils.validateExpression(expression)}`
        break
      case 'format':
        res = `Formatted: ${ExpressionUtils.formatExpression(expression)}`
        break
      case 'tokenize':
        res = `Tokens: [${ExpressionUtils.tokenizeExpression(expression).join(', ')}]`
        break
      case 'getWordAt3':
        res = `Word at pos 3: "${ExpressionUtils.getWordAtCursor(expression, 3)}"`
        break
      case 'inParens':
        res = `Cursor in parens at pos 3: ${ExpressionUtils.isCursorInParentheses(expression, 3)}`
        break
      default:
        res = 'Unknown utility'
    }
    setResult(res)
  }

  const testExpression = 'sin(π/2) + cos(0)'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expression Utilities</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Helper functions for expression validation, formatting, and manipulation
        </p>
      </div>

      {/* Test expression */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test Expression:</p>
        <p className="font-mono text-lg text-gray-900 dark:text-white">{testExpression}</p>
      </div>

      {/* Utility buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={() => runUtil('validate', testExpression)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          Validate
        </button>
        <button
          onClick={() => runUtil('format', testExpression)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          Format
        </button>
        <button
          onClick={() => runUtil('tokenize', testExpression)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          Tokenize
        </button>
        <button
          onClick={() => runUtil('getWordAt3', testExpression)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Word at 3
        </button>
        <button
          onClick={() => runUtil('inParens', testExpression)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          In Parens at 3
        </button>
      </div>

      {/* Result display */}
      {result && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg p-4">
          <p className="font-mono text-green-900 dark:text-green-100">{result}</p>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          <strong>Available utilities:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>validateExpression: Check for balanced parentheses</li>
          <li>formatExpression: Add spacing around operators</li>
          <li>tokenizeExpression: Split into tokens</li>
          <li>getWordAtCursor: Extract word at position</li>
          <li>isCursorInParentheses: Check cursor context</li>
          <li>insertOperator, insertFunction, insertParentheses: Smart insertion</li>
        </ul>
      </div>
    </div>
  )
}

export default UndoRedoDemoPage
