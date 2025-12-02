/**
 * Advanced Calculator Component
 * Enhanced calculator with history, memory, and layout customization
 */

import React, { useState } from 'react'
import CalculatorKeyboard from '@/components/calculator-keyboard'
import CalculatorDisplay from '@/components/calculator-display'
import { keyboardLayouts } from '@/config/keyboard-layouts'
import { CalculatorState } from '@/types/calculator'

interface AdvancedCalculatorProps {
  onCalculationComplete?: (result: number) => void
  showMemory?: boolean
  showHistory?: boolean
  showSettings?: boolean
}

export const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({
  onCalculationComplete,
  showMemory = true,
  showHistory = true,
  showSettings = true,
}) => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
    history: [],
  })

  const [currentLayout, setCurrentLayout] = useState('standard')
  const [isRadians, setIsRadians] = useState(true)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)

  /**
   * Handle button clicks
   */
  const handleButtonClick = (value: string) => {
    setState(prevState => {
      // Handle utility functions
      if (value === 'clear') {
        return {
          display: '0',
          previousValue: null,
          operation: null,
          waitingForNewValue: false,
          memory: 0,
          history: [...prevState.history],
        }
      }

      if (value === 'backspace') {
        const display = prevState.display === '0' ? '0' : prevState.display.slice(0, -1) || '0'
        return { ...prevState, display }
      }

      if (value === 'toggle') {
        const num = parseFloat(prevState.display)
        return { ...prevState, display: String(num * -1) }
      }

      if (value === '=') {
        if (prevState.operation && prevState.previousValue !== null) {
          const result = calculateResult(
            prevState.previousValue,
            parseFloat(prevState.display),
            prevState.operation
          )
          onCalculationComplete?.(result)
          return {
            display: String(result),
            previousValue: null,
            operation: null,
            waitingForNewValue: true,
            memory: prevState.memory,
            history: [
              ...prevState.history,
              `${prevState.previousValue} ${prevState.operation} ${prevState.display} = ${result}`,
            ],
          }
        }
        return prevState
      }

      // Handle memory operations
      if (value === 'M+') {
        return {
          ...prevState,
          memory: prevState.memory + parseFloat(prevState.display),
          display: '0',
        }
      }

      if (value === 'M-') {
        return {
          ...prevState,
          memory: prevState.memory - parseFloat(prevState.display),
          display: '0',
        }
      }

      if (value === 'MR') {
        return { ...prevState, display: String(prevState.memory), waitingForNewValue: true }
      }

      if (value === 'MC') {
        return { ...prevState, memory: 0 }
      }

      // Number input
      if (/^\d$/.test(value)) {
        const display =
          prevState.waitingForNewValue || prevState.display === '0'
            ? value
            : prevState.display + value
        return { ...prevState, display, waitingForNewValue: false }
      }

      // Decimal point
      if (value === '.') {
        if (prevState.waitingForNewValue) {
          return { ...prevState, display: '0.', waitingForNewValue: false }
        }
        if (!prevState.display.includes('.')) {
          return { ...prevState, display: prevState.display + '.' }
        }
        return prevState
      }

      // Operators
      if (['+', '-', '*', '/', '^'].includes(value)) {
        if (prevState.operation && !prevState.waitingForNewValue) {
          const result = calculateResult(
            prevState.previousValue || 0,
            parseFloat(prevState.display),
            prevState.operation
          )
          return {
            display: String(result),
            previousValue: result,
            operation: value,
            waitingForNewValue: true,
            memory: prevState.memory,
            history: prevState.history,
          }
        }
        return {
          ...prevState,
          previousValue: parseFloat(prevState.display),
          operation: value,
          waitingForNewValue: true,
        }
      }

      return prevState
    })
  }

  /**
   * Calculate result
   */
  const calculateResult = (prev: number, current: number, operation: string): number => {
    switch (operation) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return prev / current
      case '^':
        return Math.pow(prev, current)
      default:
        return current
    }
  }

  const layout = keyboardLayouts[currentLayout] || keyboardLayouts.standard

  return (
    <div className="space-y-4">
      {/* Display */}
      <CalculatorDisplay
        value={state.display}
        previousValue={String(state.previousValue || '')}
        operation={state.operation || ''}
      />

      {/* Controls Bar */}
      {showSettings && (
        <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          {/* Layout Selector */}
          <div className="flex gap-2">
            {Object.keys(keyboardLayouts).map(layoutKey => (
              <button
                key={layoutKey}
                onClick={() => setCurrentLayout(layoutKey)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  currentLayout === layoutKey
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300'
                }`}
              >
                {keyboardLayouts[layoutKey as keyof typeof keyboardLayouts].name}
              </button>
            ))}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Angle:</label>
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-600 rounded p-1">
              <button
                onClick={() => setIsRadians(true)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  isRadians ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                RAD
              </button>
              <button
                onClick={() => setIsRadians(false)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  !isRadians ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                DEG
              </button>
            </div>
          </div>

          {/* History Toggle */}
          {showHistory && (
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="px-3 py-1 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              History ({state.history.length})
            </button>
          )}
        </div>
      )}

      {/* Keyboard */}
      <CalculatorKeyboard layout={layout} onButtonClick={handleButtonClick} />

      {/* Memory Display */}
      {showMemory && state.memory !== 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Memory: {state.memory}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setState(s => ({
                  ...s,
                  memory: s.memory + parseFloat(s.display),
                }))
              }
              className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
            >
              M+
            </button>
            <button
              onClick={() =>
                setState(s => ({
                  ...s,
                  memory: s.memory - parseFloat(s.display),
                }))
              }
              className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
            >
              M-
            </button>
            <button
              onClick={() => setState(s => ({ ...s, memory: 0 }))}
              className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
            >
              MC
            </button>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && showHistoryPanel && state.history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Calculation History
            </h3>
            <button
              onClick={() => setState(s => ({ ...s, history: [] }))}
              className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 font-mono text-sm">
            {state.history.map((entry, index) => (
              <div key={index} className="text-gray-600 dark:text-gray-400 text-xs">
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedCalculator
