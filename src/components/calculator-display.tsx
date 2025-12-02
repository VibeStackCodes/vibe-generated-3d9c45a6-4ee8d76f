/**
 * Calculator Display Component
 * Shows the current calculation state and results
 */

import React from 'react'

interface CalculatorDisplayProps {
  value: string
  previousValue?: string
  operation?: string | null
  className?: string
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  value,
  previousValue,
  operation,
  className = '',
}) => {
  return (
    <div
      className={`w-full rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-md border border-indigo-100 dark:border-gray-700 ${className}`}
    >
      {/* Operation history display */}
      {(previousValue || operation) && (
        <div className="text-right text-sm text-gray-600 dark:text-gray-400 mb-2 h-5">
          {previousValue && <span className="font-medium">{previousValue}</span>}
          {operation && (
            <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
              {operation}
            </span>
          )}
        </div>
      )}

      {/* Main display */}
      <div className="text-right space-y-1">
        <input
          type="text"
          readOnly
          value={value}
          className="w-full text-4xl font-bold text-gray-900 dark:text-white text-right bg-transparent outline-none focus:outline-none p-0 placeholder-gray-400"
          placeholder="0"
          aria-label="Calculator display"
        />
      </div>

      {/* Display metadata */}
      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-right space-x-2">
        <span>Scientific Calculator</span>
      </div>
    </div>
  )
}

export default CalculatorDisplay
