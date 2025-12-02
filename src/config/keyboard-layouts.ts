/**
 * Scientific Calculator Keyboard Layouts
 * Defines customizable button layouts for different calculator modes
 * Brand Colors: Primary #4F46E5, Accent #FFB020
 */

import { KeyboardLayout } from '@/types/calculator'

/**
 * Standard Scientific Layout
 * Includes basic arithmetic, trigonometric, logarithmic, and utility functions
 */
export const standardScientificLayout: KeyboardLayout = {
  name: 'Standard Scientific',
  description: 'Full-featured scientific calculator with trig, log, and advanced functions',
  groups: [
    {
      name: 'Trigonometric',
      buttons: [
        {
          label: 'sin',
          value: 'sin',
          type: 'trigonometric',
          shortcut: 'S',
          description: 'Sine function',
        },
        {
          label: 'cos',
          value: 'cos',
          type: 'trigonometric',
          shortcut: 'C',
          description: 'Cosine function',
        },
        {
          label: 'tan',
          value: 'tan',
          type: 'trigonometric',
          shortcut: 'T',
          description: 'Tangent function',
        },
        { label: 'sin⁻¹', value: 'asin', type: 'trigonometric', description: 'Inverse sine' },
        { label: 'cos⁻¹', value: 'acos', type: 'trigonometric', description: 'Inverse cosine' },
        { label: 'tan⁻¹', value: 'atan', type: 'trigonometric', description: 'Inverse tangent' },
      ],
    },
    {
      name: 'Logarithmic',
      buttons: [
        {
          label: 'log',
          value: 'log10',
          type: 'logarithmic',
          shortcut: 'L',
          description: 'Base-10 logarithm',
        },
        { label: 'ln', value: 'ln', type: 'logarithmic', description: 'Natural logarithm' },
        { label: 'eˣ', value: 'exp', type: 'logarithmic', description: 'Exponential (e^x)' },
        { label: 'log₂', value: 'log2', type: 'logarithmic', description: 'Base-2 logarithm' },
      ],
    },
    {
      name: 'Constants',
      buttons: [
        {
          label: 'π',
          value: 'pi',
          type: 'constant',
          shortcut: 'P',
          description: 'Pi (3.14159...)',
        },
        { label: 'e', value: 'e', type: 'constant', description: "Euler's number (2.71828...)" },
        { label: 'φ', value: 'phi', type: 'constant', description: 'Golden ratio (1.618...)' },
        { label: 'c', value: 'c', type: 'constant', description: 'Speed of light (3e8 m/s)' },
      ],
    },
    {
      name: 'Operators',
      buttons: [
        { label: '+', value: '+', type: 'operator', shortcut: '+' },
        { label: '−', value: '-', type: 'operator', shortcut: '-' },
        { label: '×', value: '*', type: 'operator', shortcut: '*', description: 'Multiply' },
        { label: '÷', value: '/', type: 'operator', shortcut: '/', description: 'Divide' },
        { label: '^', value: '^', type: 'operator', shortcut: '^', description: 'Power/Exponent' },
        { label: '√', value: 'sqrt', type: 'operator', description: 'Square root' },
      ],
    },
    {
      name: 'Functions',
      buttons: [
        { label: 'x²', value: 'square', type: 'function', description: 'Square' },
        { label: 'x³', value: 'cube', type: 'function', description: 'Cube' },
        { label: '1/x', value: 'reciprocal', type: 'function', description: 'Reciprocal' },
        { label: '|x|', value: 'abs', type: 'function', description: 'Absolute value' },
        { label: 'n!', value: 'factorial', type: 'function', description: 'Factorial' },
        { label: '%', value: '%', type: 'function', description: 'Percentage' },
      ],
    },
    {
      name: 'Numbers',
      buttons: [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number', description: 'Decimal point' },
      ],
    },
    {
      name: 'Utility',
      buttons: [
        { label: '(', value: '(', type: 'utility', description: 'Open parenthesis' },
        { label: ')', value: ')', type: 'utility', description: 'Close parenthesis' },
        {
          label: '=',
          value: '=',
          type: 'utility',
          shortcut: 'Enter',
          description: 'Calculate result',
          color: 'primary',
        },
        {
          label: 'C',
          value: 'clear',
          type: 'utility',
          shortcut: 'Escape',
          description: 'Clear all',
          color: 'danger',
        },
        {
          label: '⌫',
          value: 'backspace',
          type: 'utility',
          shortcut: 'Backspace',
          description: 'Delete last digit',
          color: 'neutral',
        },
        { label: '±', value: 'toggle', type: 'utility', description: 'Toggle sign' },
      ],
    },
  ],
}

/**
 * Basic Calculator Layout
 * Simplified layout for basic arithmetic
 */
export const basicLayout: KeyboardLayout = {
  name: 'Basic',
  description: 'Simple calculator with basic arithmetic operations',
  groups: [
    {
      name: 'Numbers',
      buttons: [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
      ],
    },
    {
      name: 'Operations',
      buttons: [
        { label: '+', value: '+', type: 'operator' },
        { label: '−', value: '-', type: 'operator' },
        { label: '×', value: '*', type: 'operator' },
        { label: '÷', value: '/', type: 'operator' },
        { label: '=', value: '=', type: 'utility', color: 'primary' },
        { label: 'C', value: 'clear', type: 'utility', color: 'danger' },
      ],
    },
  ],
}

/**
 * Engineering Layout
 * Specialized layout for engineering calculations with advanced functions
 */
export const engineeringLayout: KeyboardLayout = {
  name: 'Engineering',
  description: 'Advanced layout with engineering functions and constants',
  groups: [
    {
      name: 'Physical Constants',
      buttons: [
        { label: 'c', value: 'c', type: 'constant', description: 'Speed of light' },
        { label: 'G', value: 'G', type: 'constant', description: 'Gravitational constant' },
        { label: 'h', value: 'h', type: 'constant', description: "Planck's constant" },
        { label: 'k', value: 'k', type: 'constant', description: 'Boltzmann constant' },
      ],
    },
    {
      name: 'Scientific Notation',
      buttons: [
        { label: 'e^x', value: 'exp', type: 'function' },
        { label: 'log', value: 'log10', type: 'function' },
        { label: 'ln', value: 'ln', type: 'function' },
        {
          label: '×10ⁿ',
          value: 'e-notation',
          type: 'function',
          description: 'Scientific notation',
        },
      ],
    },
    {
      name: 'Advanced',
      buttons: [
        { label: '√x', value: 'sqrt', type: 'function' },
        { label: 'ⁿ√x', value: 'nroot', type: 'function', description: 'Nth root' },
        { label: 'deg', value: 'deg', type: 'function', description: 'Degrees' },
        { label: 'rad', value: 'rad', type: 'function', description: 'Radians' },
        { label: 'π', value: 'pi', type: 'constant' },
        { label: 'e', value: 'e', type: 'constant' },
      ],
    },
  ],
}

/**
 * All available keyboard layouts
 */
export const keyboardLayouts: Record<string, KeyboardLayout> = {
  standard: standardScientificLayout,
  basic: basicLayout,
  engineering: engineeringLayout,
}
