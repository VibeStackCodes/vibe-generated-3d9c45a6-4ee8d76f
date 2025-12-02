/**
 * Scientific Calculator Components Library
 * ==========================================
 *
 * This library provides a complete scientific calculator UI with customizable button layouts.
 * All components are built with React, TypeScript, and Tailwind CSS.
 *
 * Components Overview:
 * ====================
 *
 * 1. CalculatorButton
 *    - Individual button component for the calculator keyboard
 *    - Supports multiple button types (number, operator, function, etc.)
 *    - Customizable colors and styling
 *    - Keyboard shortcuts with visual indicators
 *    - Accessibility support (ARIA labels, tooltips)
 *    Usage:
 *      import { CalculatorButtonComponent } from '@/components/calculator-button'
 *      <CalculatorButtonComponent
 *        label="sin"
 *        value="sin"
 *        type="trigonometric"
 *        onClick={(value) => handleClick(value)}
 *      />
 *
 * 2. CalculatorKeyboard
 *    - Main keyboard component with customizable layout grid
 *    - Supports multiple layout modes (grid, stack)
 *    - Grouped button organization
 *    - Responsive columns per row
 *    - Event handling for button clicks
 *    Usage:
 *      import CalculatorKeyboard from '@/components/calculator-keyboard'
 *      <CalculatorKeyboard
 *        layout={standardScientificLayout}
 *        onButtonClick={(value) => handleClick(value)}
 *        groupLayout="grid"
 *        responsiveColumns={3}
 *      />
 *
 * 3. CalculatorDisplay
 *    - Display component showing current value and operation history
 *    - Shows previous value, current operation, and result
 *    - Gradient background with dark mode support
 *    - Read-only input field for accessibility
 *    Usage:
 *      import CalculatorDisplay from '@/components/calculator-display'
 *      <CalculatorDisplay
 *        value="42"
 *        previousValue="10"
 *        operation="+"
 *      />
 *
 * 4. CalculatorPage
 *    - Complete calculator page with all features
 *    - Includes keyboard, display, controls, history, and memory
 *    - Layout switching capability
 *    - Angle mode toggle (Radians/Degrees)
 *    - Full keyboard shortcut support
 *    - Scientific function calculations
 *    Usage: Directly as a router page
 *      import CalculatorPage from '@/pages/calculator'
 *      Route: /
 *
 * 5. AdvancedCalculator
 *    - Enhanced calculator component with additional features
 *    - History panel with clear functionality
 *    - Memory management (M+, M-, MR, MC)
 *    - Settings panel for layout and mode selection
 *    - Callback on calculation complete
 *    Usage:
 *      import { AdvancedCalculator } from '@/components/calculator-advanced'
 *      <AdvancedCalculator
 *        onCalculationComplete={(result) => console.log(result)}
 *        showMemory={true}
 *        showHistory={true}
 *        showSettings={true}
 *      />
 *
 * 6. CalculatorWidget
 *    - Compact, embeddable calculator widget
 *    - Multiple size options (compact, medium, large)
 *    - Theme support (light, dark, auto)
 *    - Result change callback
 *    - Minimal branding options
 *    Usage:
 *      import { CalculatorWidget } from '@/components/calculator-widget'
 *      <CalculatorWidget
 *        size="medium"
 *        theme="dark"
 *        onResultChange={(result) => handleResult(result)}
 *      />
 *
 * Available Keyboard Layouts:
 * ==========================
 *
 * 1. Standard Scientific (default)
 *    - Full trigonometric functions (sin, cos, tan, asin, acos, atan)
 *    - Logarithmic functions (log, ln, log2, exp)
 *    - Physical constants (π, e, φ, c)
 *    - Basic arithmetic operators
 *    - Advanced functions (x², x³, 1/x, |x|, !, %)
 *    - Complete number pad
 *    - Utility buttons (parentheses, equals, clear)
 *
 * 2. Basic
 *    - Simplified layout for basic arithmetic
 *    - Standard operations (+, −, ×, ÷)
 *    - Number pad 0-9 and decimal point
 *    - Clear and equals buttons
 *
 * 3. Engineering
 *    - Advanced engineering functions
 *    - Physical constants (c, G, h, k)
 *    - Scientific notation support
 *    - Angle mode conversion (deg/rad)
 *    - Advanced roots and powers
 *
 * Type Definitions:
 * =================
 *
 * CalculatorButton
 *   - label: Display text on button
 *   - value: Value sent on click
 *   - type: Button category (number, operator, function, etc.)
 *   - shortcut?: Keyboard shortcut
 *   - description?: Tooltip description
 *   - color?: Button color theme
 *
 * ButtonGroup
 *   - name: Group name/category
 *   - buttons: Array of CalculatorButton
 *
 * KeyboardLayout
 *   - name: Layout name
 *   - groups: Array of ButtonGroup
 *   - description: Layout description
 *
 * CalculatorState
 *   - display: Current display value
 *   - previousValue: Previous operand
 *   - operation: Current operation
 *   - waitingForNewValue: Input state
 *   - memory: Stored memory value
 *   - history: Calculation history
 *
 * Utilities & Hooks:
 * =================
 *
 * useCalculator
 *   - Custom hook for calculator state management
 *   - Provides: state, handleButtonClick, clear, backspace, toggleSign, etc.
 *   - Use for managing calculator logic independently
 *
 * Calculator Math Utilities (calculator-math.ts)
 *   - degreesToRadians, radiansToDegrees
 *   - factorial (with memoization)
 *   - formatNumber (intelligent precision)
 *   - isValidExpression, safeEvaluate
 *   - permutation, combination, gcd, lcm
 *   - roundTo, calculatePercentage, etc.
 *
 * Keyboard Builder Utilities (keyboard-builder.ts)
 *   - createCustomLayout: Build custom layouts
 *   - createButtonGroup, createButton: Create components
 *   - mergeLayouts: Combine multiple layouts
 *   - createMinimalLayout, createProgrammerLayout, createFinanceLayout
 *   - validateLayout, exportLayoutAsJSON, importLayoutFromJSON
 *
 * Brand Colors & Styling:
 * =======================
 * Primary Color: #4F46E5 (Indigo-600)
 * Accent Color: #FFB020 (Amber-500)
 * Font Family: Inter
 *
 * Button Type Colors:
 *   - number: Slate gray
 *   - operator: Indigo
 *   - function: Purple
 *   - trigonometric: Blue
 *   - logarithmic: Emerald
 *   - constant: Amber
 *   - utility: Orange
 *
 * Keyboard Shortcuts:
 * ===================
 * 0-9: Number input
 * + - * / ^: Operators
 * . : Decimal point
 * ( ): Parentheses
 * Enter / =: Calculate
 * Backspace: Delete last digit
 * Escape: Clear all
 * s, c, t: sin, cos, tan
 * l: log10
 * p: pi
 * Shift + shortcuts available for additional functions
 *
 * Examples:
 * ==========
 *
 * Example 1: Basic Integration
 * import CalculatorPage from '@/pages/calculator'
 * // Use as route or component
 * <CalculatorPage />
 *
 * Example 2: Custom Layout
 * import { keyboardLayouts } from '@/config/keyboard-layouts'
 * import { createCustomLayout, createButtonGroup, createButton } from '@/utils/keyboard-builder'
 *
 * const myLayout = createCustomLayout('My Layout', [
 *   createButtonGroup('Basics', [
 *     createButton('7', '7', 'number'),
 *     createButton('8', '8', 'number'),
 *   ])
 * ])
 *
 * Example 3: Widget in Dashboard
 * import { CalculatorWidget } from '@/components/calculator-widget'
 *
 * <CalculatorWidget
 *   size="compact"
 *   theme="dark"
 *   initialLayout="basic"
 *   onResultChange={(result) => updateDashboard(result)}
 * />
 *
 * Example 4: Advanced with History
 * import { AdvancedCalculator } from '@/components/calculator-advanced'
 *
 * <AdvancedCalculator
 *   showMemory={true}
 *   showHistory={true}
 *   showSettings={true}
 *   onCalculationComplete={(result) => saveCalculation(result)}
 * />
 *
 * File Structure:
 * ===============
 * src/
 * ├── components/
 * │   ├── calculator-button.tsx
 * │   ├── calculator-keyboard.tsx
 * │   ├── calculator-display.tsx
 * │   ├── calculator-advanced.tsx
 * │   ├── calculator-widget.tsx
 * │   └── index.ts (this file)
 * ├── pages/
 * │   └── calculator.tsx
 * ├── types/
 * │   └── calculator.ts
 * ├── config/
 * │   └── keyboard-layouts.ts
 * ├── hooks/
 * │   └── useCalculator.ts
 * └── utils/
 *     ├── calculator-math.ts
 *     └── keyboard-builder.ts
 *
 * Feature Support:
 * ================
 * ✓ Scientific functions (trig, log, exp)
 * ✓ Physical constants
 * ✓ Memory management (M+, M-, MR, MC)
 * ✓ Calculation history
 * ✓ Angle mode switching (RAD/DEG)
 * ✓ Keyboard shortcuts
 * ✓ Dark mode support
 * ✓ Responsive design
 * ✓ Accessibility (ARIA labels, tooltips)
 * ✓ Multiple layout presets
 * ✓ Customizable layouts
 * ✓ Touch-first design
 * ✓ High-precision calculations
 * ✓ Error handling
 *
 * Performance Considerations:
 * ==========================
 * - Factorial calculation is memoized
 * - Button clicks are debounced with state updates
 * - Components use React.memo for optimization
 * - Lazy loading support for routes
 * - CSS is compiled with Tailwind for minimal bundle size
 */

export { default as CalculatorButtonComponent } from './calculator-button'
export { default as CalculatorKeyboard } from './calculator-keyboard'
export { default as CalculatorDisplay } from './calculator-display'
export { default as AdvancedCalculator } from './calculator-advanced'
export { default as CalculatorWidget } from './calculator-widget'
export { default as MathExpressionDisplay, type MathExpressionDisplayProps, type ViewMode } from './math-expression-display'
export { default as AdvancedExpressionEditor, type AdvancedExpressionEditorProps } from './expression-editor-advanced'
