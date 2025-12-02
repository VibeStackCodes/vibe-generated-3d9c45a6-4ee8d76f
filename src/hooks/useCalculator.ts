/**
 * useCalculator Hook
 * Custom React hook for managing calculator state and operations
 */

import { useState, useCallback } from 'react'
import { CalculatorState } from '@/types/calculator'

interface UseCalculatorReturn {
  state: CalculatorState
  handleButtonClick: (value: string) => void
  clear: () => void
  backspace: () => void
  toggleSign: () => void
  setDisplay: (value: string) => void
  getFormattedDisplay: () => string
}

export const useCalculator = (): UseCalculatorReturn => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
    history: [],
  })

  /**
   * Calculate result based on operation
   */
  const calculateResult = useCallback(
    (prev: number, current: number, operation: string): number => {
      switch (operation) {
        case '+':
          return prev + current
        case '-':
          return prev - current
        case '*':
          return prev * current
        case '/':
          return prev !== 0 ? current / prev : NaN
        case '^':
          return Math.pow(prev, current)
        default:
          return current
      }
    },
    []
  )

  /**
   * Clear calculator state
   */
  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      memory: 0,
      history: [],
    })
  }, [])

  /**
   * Backspace - remove last digit
   */
  const backspace = useCallback(() => {
    setState(prevState => {
      const newDisplay = prevState.display === '0' ? '0' : prevState.display.slice(0, -1) || '0'
      return { ...prevState, display: newDisplay }
    })
  }, [])

  /**
   * Toggle sign (positive/negative)
   */
  const toggleSign = useCallback(() => {
    setState(prevState => {
      const num = parseFloat(prevState.display)
      return { ...prevState, display: String(num * -1) }
    })
  }, [])

  /**
   * Set display value directly
   */
  const setDisplay = useCallback((value: string) => {
    setState(prevState => ({
      ...prevState,
      display: value,
      waitingForNewValue: false,
    }))
  }, [])

  /**
   * Get formatted display value (handle special cases)
   */
  const getFormattedDisplay = useCallback((): string => {
    const value = parseFloat(state.display)

    if (!isFinite(value)) {
      return 'Error'
    }

    if (Math.abs(value) > 1e10) {
      return value.toExponential(6)
    }

    return state.display
  }, [state.display])

  /**
   * Handle button clicks
   */
  const handleButtonClick = useCallback(
    (value: string) => {
      setState(prevState => {
        // Utility functions
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
            const historyEntry = `${prevState.previousValue} ${prevState.operation} ${prevState.display} = ${result}`
            return {
              display: String(result),
              previousValue: null,
              operation: null,
              waitingForNewValue: true,
              memory: prevState.memory,
              history: [...prevState.history, historyEntry],
            }
          }
          return prevState
        }

        // Memory operations
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
          return {
            ...prevState,
            display: String(prevState.memory),
            waitingForNewValue: true,
          }
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

        // Parentheses
        if (value === '(' || value === ')') {
          return { ...prevState, display: prevState.display + value }
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
    },
    [calculateResult]
  )

  return {
    state,
    handleButtonClick,
    clear,
    backspace,
    toggleSign,
    setDisplay,
    getFormattedDisplay,
  }
}
