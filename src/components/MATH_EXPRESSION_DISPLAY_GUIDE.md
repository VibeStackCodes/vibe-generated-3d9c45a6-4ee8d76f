# Math Expression Display Component - Implementation Guide

## Overview

The `MathExpressionDisplay` component is a powerful, feature-rich math expression editor with single-line and multi-line view modes. It's designed for the Keystone Calc application to provide professional expression editing capabilities for students and STEM professionals.

## Component Location

- **File**: `/src/components/math-expression-display.tsx`
- **Export**: `MathExpressionDisplay` (default export)
- **Types**: `MathExpressionDisplayProps`, `ViewMode`

## Key Features

### 1. **Dual View Modes**
   - **Single-line mode**: Horizontal display, perfect for compact expressions
   - **Multi-line mode**: Textarea-based input with automatic height expansion
   - Toggle between modes with a single button click

### 2. **Expression Editing**
   - Full read/write capability
   - Smart cursor position management
   - Auto-expanding textarea in multi-line mode
   - Character counter in footer

### 3. **Undo/Redo Stack**
   - Complete undo/redo functionality
   - Visual indicators for stack status
   - Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Shift+Z (Redo)

### 4. **Clipboard Operations**
   - Copy expressions to clipboard
   - Paste from clipboard with automatic mode adjustment
   - Keyboard shortcuts: Ctrl+C (Copy), Ctrl+V (Paste)

### 5. **Control Panel**
   - View mode toggle button
   - Undo/Redo buttons with disabled state
   - Copy/Paste buttons
   - Clear button
   - All controls are optional via props

### 6. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard shortcut support
   - Focus management
   - Screen reader friendly

### 7. **Styling**
   - Dark mode support via Tailwind CSS
   - Gradient background (indigo to purple)
   - Brand colors integrated (#4F46E5 primary, #FFB020 accent)
   - Responsive design
   - Professional UI with clear visual feedback

## Props

### `MathExpressionDisplayProps`

```typescript
interface MathExpressionDisplayProps {
  // Core props
  value: string                                    // Current expression value
  onChange?: (value: string) => void              // Callback when expression changes

  // View mode props
  viewMode?: ViewMode                             // 'single-line' | 'multi-line'
  onViewModeChange?: (mode: ViewMode) => void     // Callback when view mode changes

  // State props
  readOnly?: boolean                              // Enable read-only mode (default: false)
  placeholder?: string                            // Placeholder text (default: '0')

  // UI props
  className?: string                              // Custom CSS class
  showControls?: boolean                          // Show control panel (default: true)
  autoExpand?: boolean                            // Auto-expand textarea (default: true)

  // History props (for external history management)
  history?: string[]                              // Expression history array
  historyIndex?: number                           // Current history index
  onHistoryChange?: (index: number, value: string) => void // History change callback
}
```

## Usage Examples

### Basic Usage (Single-line Mode)

```typescript
import MathExpressionDisplay from '@/components/math-expression-display'

export function BasicExample() {
  const [expression, setExpression] = useState('2 + 2')

  return (
    <MathExpressionDisplay
      value={expression}
      onChange={setExpression}
      viewMode="single-line"
      showControls
    />
  )
}
```

### With View Mode Toggle

```typescript
export function WithToggle() {
  const [expression, setExpression] = useState('sin(π/2)')
  const [viewMode, setViewMode] = useState('single-line')

  return (
    <MathExpressionDisplay
      value={expression}
      onChange={setExpression}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showControls
      autoExpand
    />
  )
}
```

### Multi-line Scientific Expression

```typescript
export function MultilineExpression() {
  const [expression, setExpression] = useState('(x + y)² - 2xy')

  return (
    <MathExpressionDisplay
      value={expression}
      onChange={setExpression}
      viewMode="multi-line"
      placeholder="Enter your expression..."
      showControls
      autoExpand
    />
  )
}
```

### Read-only Mode (Display Only)

```typescript
export function ReadonlyExpression() {
  return (
    <MathExpressionDisplay
      value="E = mc²"
      readOnly
      viewMode="single-line"
      showControls={false}
    />
  )
}
```

### Integrated with Calculator

```typescript
import CalculatorDisplay from '@/components/calculator-display'
import MathExpressionDisplay from '@/components/math-expression-display'

export function CalculatorWithExpression() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [viewMode, setViewMode] = useState('single-line')

  return (
    <div className="space-y-4">
      <MathExpressionDisplay
        value={expression}
        onChange={setExpression}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showControls
      />
      <CalculatorDisplay value={result} />
    </div>
  )
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+Y | Redo (alternative) |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Escape | Clear all |

## Internal State Management

The component manages its own internal state including:

```typescript
interface ExpressionState {
  value: string              // Current expression
  cursorPosition: number     // Cursor/selection position
  undoStack: string[]       // Undo history
  redoStack: string[]       // Redo history
}
```

## Events and Callbacks

1. **onChange**: Triggered when expression value changes
   - Called with the new expression value
   - Allows parent components to sync state

2. **onViewModeChange**: Triggered when view mode changes
   - Called with the new view mode ('single-line' or 'multi-line')
   - Allows parent components to persist mode preference

3. **onHistoryChange**: Triggered when history navigation occurs
   - Called with history index and corresponding value
   - Useful for external history management

## Styling and Theming

### Color Scheme

- **Primary**: Indigo (#4F46E5)
- **Accent**: Amber (#FFB020)
- **Background**: Gradient from indigo-50 to purple-50 (light), gray-800 to gray-900 (dark)
- **Text**: Gray-900 (light), white (dark)

### Dark Mode

The component automatically supports dark mode via Tailwind's `dark:` prefix. All colors adapt based on the `dark` class on parent elements.

### Custom Styling

Pass custom classes via the `className` prop:

```typescript
<MathExpressionDisplay
  value="expression"
  className="rounded-xl shadow-lg border-2 border-indigo-600"
/>
```

## Performance Considerations

1. **Cursor Management**: Smart cursor positioning to preserve user's editing location
2. **Stack Limits**: Undo/Redo stacks grow unbounded (consider limiting in production)
3. **Auto-expand**: Textarea expansion is optimized with ref-based DOM updates
4. **Re-renders**: Component only re-renders when necessary (controlled via useState)

## Accessibility Features

- ARIA labels for all buttons and inputs
- Semantic HTML structure
- Keyboard navigation support
- Focus management between view modes
- Screen reader friendly tooltips
- Disabled state indicators for unavailable actions

## Testing

### Test Examples

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MathExpressionDisplay from '@/components/math-expression-display'

describe('MathExpressionDisplay', () => {
  it('renders with initial value', () => {
    render(<MathExpressionDisplay value="2 + 2" />)
    const input = screen.getByDisplayValue('2 + 2')
    expect(input).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    render(<MathExpressionDisplay value="2" onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2 + 2' } })

    expect(handleChange).toHaveBeenCalledWith('2 + 2')
  })

  it('toggles view modes', async () => {
    const handleModeChange = jest.fn()
    render(
      <MathExpressionDisplay
        value="expression"
        onViewModeChange={handleModeChange}
      />
    )

    const toggleButton = screen.getByLabelText('Toggle view mode')
    fireEvent.click(toggleButton)

    expect(handleModeChange).toHaveBeenCalledWith('multi-line')
  })

  it('handles undo action', async () => {
    const handleChange = jest.fn()
    const { rerender } = render(
      <MathExpressionDisplay value="2" onChange={handleChange} />
    )

    // Type new value
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '2 + 2' } })

    // Now undo
    const undoButton = screen.getByLabelText('Undo')
    fireEvent.click(undoButton)

    // Verify undo was called
    expect(handleChange).toHaveBeenCalled()
  })
})
```

## Demo Page

A complete demo page is available at `/expression-demo` showcasing:
- Single-line expression display
- Multi-line expression display
- All features and controls
- Usage examples
- Component documentation

Access it via: `http://localhost:5173/expression-demo`

## Integration with Keystone Calc

The `MathExpressionDisplay` component is designed to integrate seamlessly with the calculator:

1. **In Calculator Display**: Replace or enhance the basic `CalculatorDisplay`
2. **In Expression Editor**: Primary component for editing complex expressions
3. **In History Viewer**: Display historical expressions with undo/redo support
4. **In Step-by-Step Solutions**: Show expressions at each step

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Future Enhancements

Potential improvements for future versions:
1. LaTeX rendering support
2. Mathematical syntax highlighting
3. Auto-completion for functions
4. Expression validation and error display
5. History persistence to localStorage
6. Export to different formats (LaTeX, MathML, SVG)
7. Mobile-optimized touch keyboard
8. Voice input support
9. Collaborative editing support
10. Custom undo/redo step size limitations

## Troubleshooting

### Cursor position resets on change
- This is normal behavior. Use the `cursorPosition` state if you need custom cursor handling.

### Undo/Redo buttons disabled
- Stacks are empty. The stack is cleared on each new edit.

### Auto-expand not working
- Ensure `autoExpand={true}` is set and you're in multi-line mode
- Check CSS doesn't override the height style

### Dark mode not applying
- Ensure parent has `dark` class or use parent's theme toggle
- Check Tailwind CSS is properly configured

## License

Part of Keystone Calc project. See project license for details.

## Support

For issues, questions, or feature requests, refer to the project documentation or create an issue in the repository.
