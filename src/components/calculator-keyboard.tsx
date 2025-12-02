/**
 * Scientific Calculator Keyboard Component
 * Customizable button grid for scientific calculator
 * Supports multiple layout presets with dynamic configuration
 */

import React, { useCallback } from 'react'
import { KeyboardLayout, CalculatorButton } from '@/types/calculator'
import CalculatorButtonComponent from '@/components/calculator-button'

interface CalculatorKeyboardProps {
  layout: KeyboardLayout
  onButtonClick: (value: string) => void
  className?: string
  showGroups?: boolean
  groupLayout?: 'grid' | 'stack'
  responsiveColumns?: number
}

interface KeyboardGridProps {
  buttons: CalculatorButton[]
  onButtonClick: (value: string) => void
  columnsPerRow?: number
}

/**
 * Grid layout component for button rows
 */
const KeyboardGrid: React.FC<KeyboardGridProps> = ({
  buttons,
  onButtonClick,
  columnsPerRow = 3,
}) => {
  return (
    <div
      className={`grid gap-2 auto-rows-max`}
      style={{
        gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
      }}
    >
      {buttons.map((button, index) => (
        <CalculatorButtonComponent
          key={`${button.value}-${index}`}
          {...button}
          onClick={onButtonClick}
        />
      ))}
    </div>
  )
}

/**
 * Button group component with optional label
 */
const ButtonGroup: React.FC<{
  name: string
  buttons: CalculatorButton[]
  onButtonClick: (value: string) => void
  columnsPerRow?: number
  showLabel?: boolean
}> = ({ name, buttons, onButtonClick, columnsPerRow = 3, showLabel = true }) => {
  return (
    <div className="space-y-2">
      {showLabel && (
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {name}
        </h3>
      )}
      <KeyboardGrid buttons={buttons} onButtonClick={onButtonClick} columnsPerRow={columnsPerRow} />
    </div>
  )
}

/**
 * Main Scientific Calculator Keyboard Component
 */
export const CalculatorKeyboard: React.FC<CalculatorKeyboardProps> = ({
  layout,
  onButtonClick,
  className = '',
  showGroups = true,
  groupLayout = 'grid',
  responsiveColumns = 3,
}) => {
  const handleButtonClick = useCallback(
    (value: string) => {
      onButtonClick(value)
    },
    [onButtonClick]
  )

  const containerClasses = `
    w-full space-y-6 p-4 rounded-lg
    bg-gradient-to-br from-slate-50 to-slate-100
    dark:from-gray-900 dark:to-gray-800
    ${className}
  `

  if (groupLayout === 'stack') {
    return (
      <div className={containerClasses}>
        <div className="space-y-6">
          {layout.groups.map((group, index) => (
            <ButtonGroup
              key={`${group.name}-${index}`}
              name={group.name}
              buttons={group.buttons}
              onButtonClick={handleButtonClick}
              columnsPerRow={responsiveColumns}
              showLabel={showGroups}
            />
          ))}
        </div>
      </div>
    )
  }

  // Grid layout - arrange groups side by side with responsive columns
  return (
    <div className={containerClasses}>
      <div
        className="grid gap-6 auto-rows-max"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 200px), 1fr))`,
        }}
      >
        {layout.groups.map((group, index) => (
          <ButtonGroup
            key={`${group.name}-${index}`}
            name={group.name}
            buttons={group.buttons}
            onButtonClick={handleButtonClick}
            columnsPerRow={3}
            showLabel={showGroups}
          />
        ))}
      </div>
    </div>
  )
}

export default CalculatorKeyboard
