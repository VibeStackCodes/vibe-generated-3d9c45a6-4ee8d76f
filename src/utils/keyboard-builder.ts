/**
 * Keyboard Layout Builder Utility
 * Helper functions for creating and customizing calculator keyboard layouts
 */

import { KeyboardLayout, ButtonGroup, CalculatorButton, ButtonType } from '@/types/calculator'

/**
 * Create a custom keyboard layout
 */
export const createCustomLayout = (
  name: string,
  groups: ButtonGroup[],
  description: string = ''
): KeyboardLayout => {
  return {
    name,
    groups,
    description: description || `Custom layout: ${name}`,
  }
}

/**
 * Create a button group
 */
export const createButtonGroup = (name: string, buttons: CalculatorButton[]): ButtonGroup => {
  return { name, buttons }
}

/**
 * Create a single calculator button
 */
export const createButton = (
  label: string,
  value: string,
  type: ButtonType,
  options?: {
    shortcut?: string
    description?: string
    color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'danger'
  }
): CalculatorButton => {
  return {
    label,
    value,
    type,
    shortcut: options?.shortcut,
    description: options?.description,
    color: options?.color,
  }
}

/**
 * Merge multiple layouts into one
 */
export const mergeLayouts = (layouts: KeyboardLayout[]): KeyboardLayout => {
  const allGroups: ButtonGroup[] = []

  layouts.forEach(layout => {
    allGroups.push(...layout.groups)
  })

  return {
    name: 'Merged Layout',
    groups: allGroups,
    description: 'Layout created by merging multiple layouts',
  }
}

/**
 * Filter buttons by type
 */
export const filterButtonsByType = (
  buttons: CalculatorButton[],
  type: ButtonType
): CalculatorButton[] => {
  return buttons.filter(btn => btn.type === type)
}

/**
 * Add buttons to existing group
 */
export const addButtonsToGroup = (
  group: ButtonGroup,
  newButtons: CalculatorButton[]
): ButtonGroup => {
  return {
    ...group,
    buttons: [...group.buttons, ...newButtons],
  }
}

/**
 * Remove buttons from group by value
 */
export const removeButtonsFromGroup = (
  group: ButtonGroup,
  valuesToRemove: string[]
): ButtonGroup => {
  return {
    ...group,
    buttons: group.buttons.filter(btn => !valuesToRemove.includes(btn.value)),
  }
}

/**
 * Create a minimal keyboard layout (only basic operations)
 */
export const createMinimalLayout = (): KeyboardLayout => {
  return {
    name: 'Minimal',
    description: 'Minimal calculator with only basic operations',
    groups: [
      {
        name: 'Numbers & Operations',
        buttons: [
          { label: '7', value: '7', type: 'number' },
          { label: '8', value: '8', type: 'number' },
          { label: '9', value: '9', type: 'number' },
          { label: '÷', value: '/', type: 'operator' },
          { label: '4', value: '4', type: 'number' },
          { label: '5', value: '5', type: 'number' },
          { label: '6', value: '6', type: 'number' },
          { label: '×', value: '*', type: 'operator' },
          { label: '1', value: '1', type: 'number' },
          { label: '2', value: '2', type: 'number' },
          { label: '3', value: '3', type: 'number' },
          { label: '−', value: '-', type: 'operator' },
          { label: '0', value: '0', type: 'number' },
          { label: '.', value: '.', type: 'number' },
          { label: '=', value: '=', type: 'utility', color: 'primary' },
          { label: '+', value: '+', type: 'operator' },
          { label: 'C', value: 'clear', type: 'utility', color: 'danger' },
        ],
      },
    ],
  }
}

/**
 * Create a programmer-focused layout
 */
export const createProgrammerLayout = (): KeyboardLayout => {
  return {
    name: 'Programmer',
    description: 'Layout for programming with bitwise operations',
    groups: [
      {
        name: 'Bitwise Operations',
        buttons: [
          { label: 'AND', value: 'and', type: 'function', description: 'Bitwise AND' },
          { label: 'OR', value: 'or', type: 'function', description: 'Bitwise OR' },
          { label: 'XOR', value: 'xor', type: 'function', description: 'Bitwise XOR' },
          { label: 'NOT', value: 'not', type: 'function', description: 'Bitwise NOT' },
          { label: '<<', value: 'lshift', type: 'function', description: 'Left shift' },
          { label: '>>', value: 'rshift', type: 'function', description: 'Right shift' },
        ],
      },
      {
        name: 'Number Base',
        buttons: [
          { label: 'HEX', value: 'hex', type: 'function', description: 'Hexadecimal' },
          { label: 'DEC', value: 'dec', type: 'function', description: 'Decimal' },
          { label: 'OCT', value: 'oct', type: 'function', description: 'Octal' },
          { label: 'BIN', value: 'bin', type: 'function', description: 'Binary' },
        ],
      },
    ],
  }
}

/**
 * Create a finance/business calculator layout
 */
export const createFinanceLayout = (): KeyboardLayout => {
  return {
    name: 'Finance',
    description: 'Layout for financial calculations',
    groups: [
      {
        name: 'Financial Functions',
        buttons: [
          { label: '%', value: '%', type: 'function', description: 'Percentage' },
          { label: 'Δ%', value: 'pct-change', type: 'function', description: 'Percentage change' },
          { label: 'PV', value: 'pv', type: 'function', description: 'Present value' },
          { label: 'FV', value: 'fv', type: 'function', description: 'Future value' },
          { label: 'PMT', value: 'pmt', type: 'function', description: 'Payment' },
          { label: 'NPV', value: 'npv', type: 'function', description: 'Net present value' },
        ],
      },
    ],
  }
}

/**
 * Get all available preset layouts
 */
export const getAllPresetLayouts = (): Record<string, () => KeyboardLayout> => {
  return {
    minimal: createMinimalLayout,
    programmer: createProgrammerLayout,
    finance: createFinanceLayout,
  }
}

/**
 * Validate keyboard layout
 */
export const validateLayout = (layout: KeyboardLayout): boolean => {
  if (!layout.name || !Array.isArray(layout.groups)) {
    return false
  }

  return layout.groups.every(group => {
    return (
      group.name &&
      Array.isArray(group.buttons) &&
      group.buttons.every(btn => btn.label && btn.value && btn.type)
    )
  })
}

/**
 * Get button count in layout
 */
export const getButtonCount = (layout: KeyboardLayout): number => {
  return layout.groups.reduce((total, group) => total + group.buttons.length, 0)
}

/**
 * Export layout as JSON
 */
export const exportLayoutAsJSON = (layout: KeyboardLayout): string => {
  return JSON.stringify(layout, null, 2)
}

/**
 * Import layout from JSON
 */
export const importLayoutFromJSON = (jsonString: string): KeyboardLayout | null => {
  try {
    const layout = JSON.parse(jsonString) as KeyboardLayout
    if (validateLayout(layout)) {
      return layout
    }
    return null
  } catch {
    return null
  }
}
