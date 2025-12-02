/**
 * Scientific Calculator Math Utilities
 * Provides high-precision mathematical functions
 */

/**
 * Convert degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI)
}

/**
 * Calculate factorial with memoization
 */
const factorialCache: Record<number, number> = {}

export const factorial = (n: number): number => {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  if (factorialCache[n]) return factorialCache[n]

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }

  factorialCache[n] = result
  return result
}

/**
 * Format number with appropriate precision
 */
export const formatNumber = (value: number, maxDecimals: number = 12): string => {
  if (!isFinite(value)) {
    return 'Error'
  }

  // Handle very small numbers
  if (Math.abs(value) < 1e-10) {
    return '0'
  }

  // Handle very large numbers
  if (Math.abs(value) > 1e10) {
    return value.toExponential(maxDecimals)
  }

  // Round to maxDecimals places
  const rounded = Math.round(value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals)

  // Remove trailing zeros
  return parseFloat(rounded.toPrecision(maxDecimals)).toString()
}

/**
 * Validate mathematical expression
 */
export const isValidExpression = (expression: string): boolean => {
  // Check for balanced parentheses
  let parenCount = 0
  for (const char of expression) {
    if (char === '(') parenCount++
    if (char === ')') parenCount--
    if (parenCount < 0) return false
  }
  if (parenCount !== 0) return false

  // Check for valid operators
  const invalidPattern = /[+\-*/^]{2,}|[+\-*/^]$|^[*/^]/
  return !invalidPattern.test(expression)
}

/**
 * Safely evaluate mathematical expression
 */
export const safeEvaluate = (expression: string): number | null => {
  try {
    if (!isValidExpression(expression)) {
      return null
    }

    // Replace common mathematical notations
    const normalizedExpression = expression
      .replace(/π/g, String(Math.PI))
      .replace(/e/g, String(Math.E))
      .replace(/\^/g, '**')
      .replace(/√/g, 'Math.sqrt')

    // Prevent execution of dangerous code
    if (
      /[a-zA-Z_]/.test(
        normalizedExpression.replace(/Math\./g, '').replace(/sin|cos|tan|sqrt|log|exp|abs/g, '')
      )
    ) {
      return null
    }

    const result = Function(`'use strict'; return (${normalizedExpression})`)()

    if (!isFinite(result)) {
      return null
    }

    return result
  } catch {
    return null
  }
}

/**
 * Parse and validate user input
 */
export const parseInput = (input: string): string | number | null => {
  const trimmed = input.trim()

  if (!trimmed) {
    return null
  }

  // Try to parse as number
  const num = parseFloat(trimmed)
  if (!isNaN(num)) {
    return num
  }

  // Try to evaluate as expression
  const result = safeEvaluate(trimmed)
  if (result !== null) {
    return result
  }

  return trimmed
}

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100
}

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100
}

/**
 * Round to specific decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Check if number is integer
 */
export const isInteger = (value: number): boolean => {
  return Number.isInteger(value) || value === Math.floor(value)
}

/**
 * Get greatest common divisor (GCD)
 */
export const gcd = (a: number, b: number): number => {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/**
 * Get least common multiple (LCM)
 */
export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b)
}

/**
 * Calculate combinatorial permutations: P(n, r)
 */
export const permutation = (n: number, r: number): number => {
  if (r > n || r < 0 || n < 0) return NaN
  return factorial(n) / factorial(n - r)
}

/**
 * Calculate combinatorial combinations: C(n, r)
 */
export const combination = (n: number, r: number): number => {
  if (r > n || r < 0 || n < 0) return NaN
  return factorial(n) / (factorial(r) * factorial(n - r))
}
