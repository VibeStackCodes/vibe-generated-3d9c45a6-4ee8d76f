/**
 * Scientific Calculator Type Definitions
 * Defines interfaces for calculator functionality and keyboard layout
 */

export type ButtonType =
  | 'number'
  | 'operator'
  | 'function'
  | 'trigonometric'
  | 'logarithmic'
  | 'constant'
  | 'utility'

export interface CalculatorButton {
  label: string
  value: string
  type: ButtonType
  shortcut?: string
  description?: string
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'danger'
}

export interface ButtonGroup {
  name: string
  buttons: CalculatorButton[]
}

export interface KeyboardLayout {
  name: string
  groups: ButtonGroup[]
  description: string
}

export interface CalculatorState {
  display: string
  previousValue: number | null
  operation: string | null
  waitingForNewValue: boolean
  memory: number
  history: string[]
}
