/**
 * Math Expression Display Demo Page
 * Showcases the math expression display component with different view modes and features
 */

import React, { useState } from 'react'
import MathExpressionDisplay, { ViewMode } from '@/components/math-expression-display'

/**
 * Expression Demo Page Component
 */
export const ExpressionDemoPage: React.FC = () => {
  const [expression1, setExpression1] = useState('sin(π/2) + cos(0)')
  const [expression2, setExpression2] = useState('(10 + 5) * 2')
  const [expression3, setExpression3] = useState('√16 = 4')
  const [viewMode1, setViewMode1] = useState<ViewMode>('single-line')
  const [viewMode2, setViewMode2] = useState<ViewMode>('single-line')
  const [viewMode3, setViewMode3] = useState<ViewMode>('multi-line')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Math Expression Display</h1>
          <p className="text-indigo-200">Single-line and multi-line view modes with editing capabilities</p>
        </div>

        {/* Demo Section 1: Single-line trigonometric expression */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Trigonometric Expression
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Single-line mode: Perfect for displaying compact math expressions
            </p>
          </div>

          <MathExpressionDisplay
            value={expression1}
            onChange={setExpression1}
            viewMode={viewMode1}
            onViewModeChange={setViewMode1}
            placeholder="Enter expression..."
            showControls
            autoExpand
          />

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Features:</strong> Undo/Redo, Copy/Paste, View mode toggle, Character count
            </p>
            <p>
              <strong>Current mode:</strong> {viewMode1} • <strong>Length:</strong> {expression1.length} characters
            </p>
          </div>
        </div>

        {/* Demo Section 2: Multi-expression arithmetic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Arithmetic Expression
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Switch between single-line and multi-line modes using the view toggle button
            </p>
          </div>

          <MathExpressionDisplay
            value={expression2}
            onChange={setExpression2}
            viewMode={viewMode2}
            onViewModeChange={setViewMode2}
            placeholder="Enter expression..."
            showControls
            autoExpand
          />

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Try:</strong> Paste complex expressions, use Ctrl+Z to undo, Ctrl+V to paste
            </p>
            <p>
              <strong>Keyboard shortcuts:</strong>
              <br />
              • Ctrl+Z: Undo • Ctrl+Shift+Z: Redo • Ctrl+C: Copy • Ctrl+V: Paste • Escape: Clear
            </p>
          </div>
        </div>

        {/* Demo Section 3: Multi-line expression */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Multi-line Expression
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Multi-line mode with automatic height expansion and multi-line input support
            </p>
          </div>

          <MathExpressionDisplay
            value={expression3}
            onChange={setExpression3}
            viewMode={viewMode3}
            onViewModeChange={setViewMode3}
            placeholder="Enter multi-line expression..."
            showControls
            autoExpand
          />

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Multi-line benefits:</strong> Better for complex equations, automatic height adjustment,
              easier to read long expressions
            </p>
            <p>
              <strong>Expression:</strong>
              <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded ml-1">
                {expression3 || '(empty)'}
              </code>
            </p>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="bg-indigo-900 rounded-2xl shadow-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">Component Features</h2>

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
                  <h3 className="text-white font-semibold">Single-line Mode</h3>
                  <p className="text-indigo-200 text-sm">Compact horizontal display for simple expressions</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Multi-line Mode</h3>
                  <p className="text-indigo-200 text-sm">Expandable textarea for complex multi-line expressions</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Undo/Redo</h3>
                  <p className="text-indigo-200 text-sm">Full undo/redo stack with keyboard shortcuts</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Copy/Paste</h3>
                  <p className="text-indigo-200 text-sm">Clipboard integration with keyboard support</p>
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
                  <h3 className="text-white font-semibold">Smart Cursor</h3>
                  <p className="text-indigo-200 text-sm">Intelligent cursor position management</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Auto-expand</h3>
                  <p className="text-indigo-200 text-sm">Textarea automatically resizes to fit content</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Dark Mode</h3>
                  <p className="text-indigo-200 text-sm">Full dark mode support with Tailwind CSS</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Accessibility</h3>
                  <p className="text-indigo-200 text-sm">ARIA labels, keyboard support, screen reader friendly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Usage Guide</h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Basic Usage
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`import { MathExpressionDisplay } from '@/components'

export function MyComponent() {
  const [expression, setExpression] = useState('2 + 2')

  return (
    <MathExpressionDisplay
      value={expression}
      onChange={setExpression}
      viewMode="single-line"
      showControls
      autoExpand
    />
  )
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                With View Mode Toggle
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`const [viewMode, setViewMode] = useState('single-line')

<MathExpressionDisplay
  value={expression}
  onChange={setExpression}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  showControls
/>
`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Ctrl+Z / Cmd+Z:</strong> Undo
                </li>
                <li>
                  <strong>Ctrl+Shift+Z / Cmd+Shift+Z:</strong> Redo
                </li>
                <li>
                  <strong>Ctrl+Y / Cmd+Y:</strong> Redo (alternative)
                </li>
                <li>
                  <strong>Ctrl+C / Cmd+C:</strong> Copy
                </li>
                <li>
                  <strong>Ctrl+V / Cmd+V:</strong> Paste
                </li>
                <li>
                  <strong>Escape:</strong> Clear all
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-indigo-200 text-sm">
          <p>Math Expression Display Component • Part of Keystone Calc</p>
        </div>
      </div>
    </div>
  )
}

export default ExpressionDemoPage
