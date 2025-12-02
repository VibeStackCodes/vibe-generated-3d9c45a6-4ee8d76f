/**
 * Expression Editor Utilities
 * Helper functions for expression editing operations
 */

/**
 * Validate mathematical expression syntax
 * Basic validation - checks for balanced parentheses and valid operators
 * @param expression - The expression to validate
 * @returns true if expression appears valid, false otherwise
 */
export const validateExpression = (expression: string): boolean => {
  if (!expression || expression.trim() === '') {
    return true // Empty is valid
  }

  // Check for balanced parentheses
  let parenCount = 0
  for (const char of expression) {
    if (char === '(') parenCount++
    if (char === ')') parenCount--
    if (parenCount < 0) return false
  }

  if (parenCount !== 0) return false

  // Check for balanced square brackets
  let bracketCount = 0
  for (const char of expression) {
    if (char === '[') bracketCount++
    if (char === ']') bracketCount--
    if (bracketCount < 0) return false
  }

  if (bracketCount !== 0) return false

  return true
}

/**
 * Insert operator with smart spacing
 * @param expression - Current expression
 * @param operator - Operator to insert
 * @param cursorPos - Current cursor position
 * @returns Modified expression and new cursor position
 */
export const insertOperator = (
  expression: string,
  operator: string,
  cursorPos: number
): { expression: string; cursorPos: number } => {
  const before = expression.slice(0, cursorPos).trimEnd()
  const after = expression.slice(cursorPos).trimStart()

  // Avoid multiple operators in a row
  if (before.length > 0 && /[+\-*/]$/.test(before)) {
    // Replace the previous operator
    const newBefore = before.slice(0, -1)
    const newExpression = newBefore + ' ' + operator + ' ' + after
    return {
      expression: newExpression,
      cursorPos: newBefore.length + operator.length + 2,
    }
  }

  const newExpression = before + ' ' + operator + ' ' + after
  return {
    expression: newExpression,
    cursorPos: before.length + operator.length + 2,
  }
}

/**
 * Insert function with proper syntax
 * @param expression - Current expression
 * @param functionName - Function name (e.g., 'sin', 'cos')
 * @param cursorPos - Current cursor position
 * @returns Modified expression and new cursor position
 */
export const insertFunction = (
  expression: string,
  functionName: string,
  cursorPos: number
): { expression: string; cursorPos: number } => {
  const before = expression.slice(0, cursorPos).trimEnd()
  const after = expression.slice(cursorPos).trimStart()

  // Add parentheses for function call
  const newExpression = before + functionName + '(' + after + ')'
  return {
    expression: newExpression,
    cursorPos: before.length + functionName.length + 1,
  }
}

/**
 * Insert parentheses pair
 * @param expression - Current expression
 * @param cursorPos - Current cursor position
 * @returns Modified expression and new cursor position
 */
export const insertParentheses = (
  expression: string,
  cursorPos: number
): { expression: string; cursorPos: number } => {
  const before = expression.slice(0, cursorPos)
  const after = expression.slice(cursorPos)

  const newExpression = before + '()' + after
  return {
    expression: newExpression,
    cursorPos: before.length + 1,
  }
}

/**
 * Get the expression up to cursor position
 * @param expression - Full expression
 * @param cursorPos - Cursor position
 * @returns Expression substring
 */
export const getExpressionBefore = (expression: string, cursorPos: number): string => {
  return expression.slice(0, cursorPos)
}

/**
 * Get the expression after cursor position
 * @param expression - Full expression
 * @param cursorPos - Cursor position
 * @returns Expression substring
 */
export const getExpressionAfter = (expression: string, cursorPos: number): string => {
  return expression.slice(cursorPos)
}

/**
 * Format expression with proper spacing
 * @param expression - Expression to format
 * @returns Formatted expression
 */
export const formatExpression = (expression: string): string => {
  // Add spaces around operators
  let formatted = expression
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*([+\-*/])\s*/g, ' $1 ')
    .trim()

  return formatted
}

/**
 * Check if cursor is inside parentheses
 * @param expression - Full expression
 * @param cursorPos - Cursor position
 * @returns true if cursor is inside parentheses
 */
export const isCursorInParentheses = (expression: string, cursorPos: number): boolean => {
  let openCount = 0

  for (let i = 0; i < cursorPos && i < expression.length; i++) {
    if (expression[i] === '(') openCount++
    if (expression[i] === ')') openCount--
  }

  return openCount > 0
}

/**
 * Get the matching closing parenthesis position
 * @param expression - Full expression
 * @param openPos - Position of opening parenthesis
 * @returns Position of closing parenthesis, or -1 if not found
 */
export const findMatchingParen = (expression: string, openPos: number): number => {
  if (expression[openPos] !== '(') return -1

  let depth = 1
  for (let i = openPos + 1; i < expression.length; i++) {
    if (expression[i] === '(') depth++
    if (expression[i] === ')') depth--
    if (depth === 0) return i
  }

  return -1
}

/**
 * Get the matching opening parenthesis position
 * @param expression - Full expression
 * @param closePos - Position of closing parenthesis
 * @returns Position of opening parenthesis, or -1 if not found
 */
export const findMatchingOpenParen = (expression: string, closePos: number): number => {
  if (expression[closePos] !== ')') return -1

  let depth = 1
  for (let i = closePos - 1; i >= 0; i--) {
    if (expression[i] === ')') depth++
    if (expression[i] === '(') depth--
    if (depth === 0) return i
  }

  return -1
}

/**
 * Extract tokens from expression
 * Useful for syntax highlighting or validation
 * @param expression - Expression to tokenize
 * @returns Array of tokens
 */
export const tokenizeExpression = (expression: string): string[] => {
  const tokens: string[] = []
  let current = ''

  for (const char of expression) {
    if (/[\s()[\]{}+\-*/]/.test(char)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      if (char.trim()) {
        tokens.push(char)
      }
    } else {
      current += char
    }
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

/**
 * Check if character is a valid operator
 * @param char - Character to check
 * @returns true if character is an operator
 */
export const isOperator = (char: string): boolean => {
  return /[+\-*/^%]/.test(char)
}

/**
 * Check if character is a digit or decimal point
 * @param char - Character to check
 * @returns true if character is numeric
 */
export const isNumeric = (char: string): boolean => {
  return /[0-9.]/.test(char)
}

/**
 * Get word at cursor position
 * Useful for autocomplete or function hints
 * @param expression - Full expression
 * @param cursorPos - Cursor position
 * @returns Word at cursor
 */
export const getWordAtCursor = (expression: string, cursorPos: number): string => {
  let start = cursorPos
  let end = cursorPos

  // Find start of word
  while (start > 0 && /[a-zA-Z0-9_]/.test(expression[start - 1])) {
    start--
  }

  // Find end of word
  while (end < expression.length && /[a-zA-Z0-9_]/.test(expression[end])) {
    end++
  }

  return expression.slice(start, end)
}

export default {
  validateExpression,
  insertOperator,
  insertFunction,
  insertParentheses,
  getExpressionBefore,
  getExpressionAfter,
  formatExpression,
  isCursorInParentheses,
  findMatchingParen,
  findMatchingOpenParen,
  tokenizeExpression,
  isOperator,
  isNumeric,
  getWordAtCursor,
}
