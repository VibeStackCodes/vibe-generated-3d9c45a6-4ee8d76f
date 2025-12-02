/**
 * Calculator Widget Component
 * Compact, embeddable calculator widget with customizable appearance
 */

import React, { useState } from 'react'
import CalculatorKeyboard from '@/components/calculator-keyboard'
import CalculatorDisplay from '@/components/calculator-display'
import { keyboardLayouts } from '@/config/keyboard-layouts'
import { CalculatorState } from '@/types/calculator'

interface CalculatorWidgetProps {
  onResultChange?: (result: number) => void
  initialLayout?: 'standard' | 'basic' | 'engineering'
  size?: 'compact' | 'medium' | 'large'
  showBrand?: boolean
  className?: string
  theme?: 'light' | 'dark' | 'auto'
}

const sizeClasses = {
  compact: 'max-w-md',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({
  onResultChange,
  initialLayout = 'standard',
  size = 'medium',
  showBrand = true,
  className = '',
  theme = 'auto',
}) => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
    history: [],
  })

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
          onResultChange?.(result)
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

  const layout = keyboardLayouts[initialLayout] || keyboardLayouts.standard

  const themeClass = theme === 'auto' ? '' : theme === 'dark' ? 'dark' : ''

  return (
    <div className={`${themeClass} ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          mx-auto
          bg-white dark:bg-gray-800
          rounded-2xl
          shadow-xl
          p-6
          space-y-4
          border border-gray-200 dark:border-gray-700
        `}
      >
        {/* Header */}
        {showBrand && (
          <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calculator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{layout.name} Mode</p>
          </div>
        )}

        {/* Display */}
        <CalculatorDisplay
          value={state.display}
          previousValue={String(state.previousValue || '')}
          operation={state.operation || ''}
        />

        {/* Keyboard */}
        <CalculatorKeyboard
          layout={layout}
          onButtonClick={handleButtonClick}
          groupLayout="stack"
          responsiveColumns={4}
        />

        {/* Status Bar */}
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
          {state.memory !== 0 && <span>Memory: {state.memory} • </span>}
          <span>Total calculations: {state.history.length}</span>
        </div>
      </div>
    </div>
  )
}

export default CalculatorWidget
