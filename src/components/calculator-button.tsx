/**
 * Calculator Button Component
 * Individual button for the scientific calculator keyboard
 */

import React from 'react'
import { CalculatorButton } from '@/types/calculator'

interface CalculatorButtonProps extends CalculatorButton {
  onClick: (value: string) => void
  isActive?: boolean
  isPressed?: boolean
}

const colorClasses: Record<string, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white',
  accent: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
  neutral: 'bg-gray-400 hover:bg-gray-500 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
}

const typeClasses: Record<string, string> = {
  number:
    'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-semibold',
  operator: 'bg-indigo-500 hover:bg-indigo-600 text-white font-semibold',
  function: 'bg-purple-500 hover:bg-purple-600 text-white text-sm',
  trigonometric: 'bg-blue-500 hover:bg-blue-600 text-white text-sm',
  logarithmic: 'bg-emerald-500 hover:bg-emerald-600 text-white text-sm',
  constant: 'bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold',
  utility: 'bg-orange-500 hover:bg-orange-600 text-white font-semibold',
}

export const CalculatorButtonComponent: React.FC<CalculatorButtonProps> = ({
  label,
  value,
  type,
  shortcut,
  description,
  color,
  onClick,
  isActive = false,
  isPressed = false,
}) => {
  // Use custom color if provided, otherwise use type-based color
  const buttonClass = color ? colorClasses[color] : typeClasses[type] || typeClasses.number

  const baseClasses =
    'w-full h-14 rounded-lg transition-all duration-150 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed'

  const stateClasses = isPressed ? 'scale-95 shadow-inset' : 'active:scale-95'

  const title = description
    ? `${label}${shortcut ? ` (${shortcut})` : ''}\n${description}`
    : `${label}${shortcut ? ` (${shortcut})` : ''}`

  return (
    <button
      onClick={() => onClick(value)}
      className={`${baseClasses} ${buttonClass} ${stateClasses} ${isActive ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
      title={title}
      aria-label={title}
      type="button"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-center leading-tight">{label}</span>
        {shortcut && <span className="text-xs opacity-60 mt-0.5">{shortcut}</span>}
      </div>
    </button>
  )
}

export default CalculatorButtonComponent
