/**
 * Scientific Calculator Page
 * Main calculator interface with keyboard, display, and layout switching
 */

import React, { useState, useCallback, useEffect } from 'react'
import CalculatorKeyboard from '@/components/calculator-keyboard'
import CalculatorDisplay from '@/components/calculator-display'
import { keyboardLayouts } from '@/config/keyboard-layouts'
import { CalculatorState } from '@/types/calculator'

/**
 * Calculate result based on operation
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

/**
 * Calculate factorial
 */
const factorial = (n: number): number => {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

/**
 * Handle scientific function evaluation
 */
const handleScientificFunction = (
  func: string,
  prevState: CalculatorState,
  isRad: boolean
): CalculatorState => {
  const value = parseFloat(prevState.display)
  const angle = isRad ? value : (value * Math.PI) / 180

  const functions: Record<string, number | undefined> = {
    sin: Math.sin(angle),
    cos: Math.cos(angle),
    tan: Math.tan(angle),
    asin: (isRad ? Math.asin(value) : (Math.asin(value) * 180) / Math.PI) || undefined,
    acos: (isRad ? Math.acos(value) : (Math.acos(value) * 180) / Math.PI) || undefined,
    atan: (isRad ? Math.atan(value) : (Math.atan(value) * 180) / Math.PI) || undefined,
    log10: Math.log10(value),
    ln: Math.log(value),
    log2: Math.log2(value),
    exp: Math.exp(value),
    sqrt: Math.sqrt(value),
    square: value * value,
    cube: value * value * value,
    reciprocal: 1 / value,
    abs: Math.abs(value),
    factorial: factorial(value),
    pi: Math.PI,
    e: Math.E,
    phi: (1 + Math.sqrt(5)) / 2,
    c: 299792458,
  }

  const result = functions[func]

  if (result !== undefined) {
    return {
      ...prevState,
      display: String(result),
      waitingForNewValue: true,
    }
  }

  return prevState
}

/**
 * Main Scientific Calculator Component
 */
export const CalculatorPage: React.FC = () => {
  // State management for calculator
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

  /**
   * Handle button clicks from keyboard
   */
  const handleButtonClick = useCallback(
    (value: string) => {
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

        // Handle number input
        if (/^\d$/.test(value)) {
          const display =
            prevState.waitingForNewValue || prevState.display === '0'
              ? value
              : prevState.display + value
          return { ...prevState, display, waitingForNewValue: false }
        }

        // Handle decimal point
        if (value === '.') {
          if (prevState.waitingForNewValue) {
            return { ...prevState, display: '0.', waitingForNewValue: false }
          }
          if (!prevState.display.includes('.')) {
            return { ...prevState, display: prevState.display + '.' }
          }
          return prevState
        }

        // Handle parentheses
        if (value === '(' || value === ')') {
          return { ...prevState, display: prevState.display + value }
        }

        // Handle operators
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

        // Handle scientific functions
        return handleScientificFunction(value, prevState, isRadians)
      })
    },
    [isRadians]
  )

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Map keyboard keys to calculator values
      const keyMap: Record<string, string> = {
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '.': '.',
        '(': '(',
        ')': ')',
        Enter: '=',
        '=': '=',
        Backspace: 'backspace',
        Escape: 'clear',
        s: 'sin',
        c: 'cos',
        t: 'tan',
        l: 'log10',
        p: 'pi',
        '^': '^',
      }

      const keyValue = keyMap[e.key]
      if (keyValue && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleButtonClick(keyValue)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleButtonClick])

  const layout = keyboardLayouts[currentLayout] || keyboardLayouts.standard

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Keystone Calc</h1>
          <p className="text-indigo-200">Scientific Calculator for Students & STEM Professionals</p>
        </div>

        {/* Main Calculator Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6">
          {/* Display */}
          <CalculatorDisplay
            value={state.display}
            previousValue={String(state.previousValue || '')}
            operation={state.operation || ''}
          />

          {/* Controls Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Layout Selector */}
            <div className="flex gap-2">
              {Object.keys(keyboardLayouts).map(layoutKey => (
                <button
                  key={layoutKey}
                  onClick={() => setCurrentLayout(layoutKey)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentLayout === layoutKey
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title={keyboardLayouts[layoutKey as keyof typeof keyboardLayouts].description}
                >
                  {keyboardLayouts[layoutKey as keyof typeof keyboardLayouts].name}
                </button>
              ))}
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Angle Mode:
              </label>
              <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setIsRadians(true)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    isRadians ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  RAD
                </button>
                <button
                  onClick={() => setIsRadians(false)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    !isRadians ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  DEG
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard */}
          <CalculatorKeyboard
            layout={layout}
            onButtonClick={handleButtonClick}
            groupLayout="grid"
            responsiveColumns={3}
          />

          {/* Memory Display (if memory is not zero) */}
          {state.memory !== 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Memory</span>
              <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                {state.memory}
              </span>
            </div>
          )}

          {/* History (if available) */}
          {state.history.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-32 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                History
              </h3>
              <div className="space-y-1 font-mono text-sm">
                {state.history.slice(-5).map((entry, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-indigo-200 text-sm">
          <p>Use keyboard shortcuts for faster calculations • Press Escape to clear</p>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage
