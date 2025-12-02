# Undo/Redo Functionality Guide

## Overview

This guide explains the comprehensive undo/redo state management system implemented for the Keystone Calc expression editor. The system provides robust history tracking with intelligent state management, keyboard shortcuts, and expression-aware editing capabilities.

## Core Hooks

### 1. useUndoRedo Hook

A generic, reusable hook for managing undo/redo state for any value type.

**Features:**
- Automatic history tracking with configurable limits
- Separate undo and redo stacks
- Keyboard shortcut support (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y)
- Type-safe operations
- Memory-efficient stack management

**Usage:**

```typescript
import { useUndoRedo } from '@/hooks'

function MyComponent() {
  const undoRedo = useUndoRedo('initial value', {
    maxHistory: 50,
    enableKeyboardShortcuts: true,
  })

  return (
    <>
      <input
        value={undoRedo.value}
        onChange={(e) => undoRedo.setValue(e.target.value)}
      />
      <button onClick={undoRedo.undo} disabled={!undoRedo.canUndo}>
        Undo ({undoRedo.undoCount})
      </button>
      <button onClick={undoRedo.redo} disabled={!undoRedo.canRedo}>
        Redo ({undoRedo.redoCount})
      </button>
    </>
  )
}
```

**API:**

```typescript
interface UndoRedoState {
  value: string
  undoStack: string[]
  redoStack: string[]
  canUndo: boolean
  canRedo: boolean
  undoCount: number
  redoCount: number
}

interface UndoRedoActions {
  setValue: (value: string) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
  getState: () => UndoRedoState
}
```

### 2. useExpressionEditor Hook

A specialized hook built on top of `useUndoRedo` for mathematical expression editing.

**Features:**
- Full expression state management
- Cursor position tracking
- Selection range management
- Expression validation
- Copy/paste operations
- Smart text insertion and deletion
- Timestamp tracking for last modification

**Usage:**

```typescript
import { useExpressionEditor } from '@/hooks'

function ExpressionEditor() {
  const editor = useExpressionEditor({
    initialExpression: '2 + 2',
    onExpressionChange: (expr) => console.log(expr),
    validator: (expr) => validateExpression(expr),
  })

  return (
    <>
      <textarea
        value={editor.expression}
        onChange={(e) => editor.setExpression(e.target.value)}
      />
      <button onClick={editor.undo}>Undo</button>
      <button onClick={editor.redo}>Redo</button>
      <button onClick={editor.copy}>Copy</button>
      <button onClick={editor.paste}>Paste</button>
    </>
  )
}
```

**API:**

```typescript
interface ExpressionEditorState {
  expression: string
  cursorPosition: number
  selectionStart: number
  selectionEnd: number
  isValid: boolean
  lastModifiedTime: number
}

interface ExpressionEditorActions {
  setExpression: (expression: string) => void
  insertText: (text: string) => void
  deleteText: (start: number, end: number) => void
  replaceText: (start: number, end: number, replacement: string) => void
  clear: () => void
  setCursorPosition: (position: number) => void
  setSelection: (start: number, end: number) => void
  getSelectedText: () => string
  copy: () => Promise<void>
  paste: () => Promise<void>
  undo: () => void
  redo: () => void
  getState: () => ExpressionEditorState
}
```

## Utility Functions

Located in `src/utils/expression-editor.ts`, these functions provide smart expression handling:

### Validation

```typescript
validateExpression(expression: string): boolean
```
Checks for balanced parentheses and brackets.

### Smart Insertion

```typescript
insertOperator(expression: string, operator: string, cursorPos: number)
insertFunction(expression: string, functionName: string, cursorPos: number)
insertParentheses(expression: string, cursorPos: number)
```
Automatically add spacing and syntax for operators and functions.

### Analysis

```typescript
formatExpression(expression: string): string
tokenizeExpression(expression: string): string[]
isCursorInParentheses(expression: string, cursorPos: number): boolean
findMatchingParen(expression: string, openPos: number): number
findMatchingOpenParen(expression: string, closePos: number): number
getWordAtCursor(expression: string, cursorPos: number): string
```

### Character Classification

```typescript
isOperator(char: string): boolean
isNumeric(char: string): boolean
```

## Components

### AdvancedExpressionEditor

A ready-to-use expression editor component with full undo/redo support.

**Features:**
- Syntax highlighting
- Smart text insertion
- Copy/paste support
- Expression validation feedback
- Automatic textarea expansion
- Undo/redo buttons with visual feedback

**Usage:**

```typescript
import { AdvancedExpressionEditor } from '@/components'

export function MyApp() {
  const [expr, setExpr] = useState('2 + 2')

  return (
    <AdvancedExpressionEditor
      initialValue={expr}
      onChange={setExpr}
      showControls
      showStats
      enableSyntaxHighlight
      enableSmartInsertion
      autoExpand
    />
  )
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Ctrl+Y` / `Cmd+Y` | Redo (alternative) |
| `Ctrl+C` / `Cmd+C` | Copy |
| `Ctrl+V` / `Cmd+V` | Paste |
| `Escape` | Clear |

## Implementation Details

### State Management

The undo/redo system maintains two stacks:

1. **Undo Stack**: Previous values that can be restored
2. **Redo Stack**: Values that were undone and can be restored

When a new value is set:
- The current value is pushed to the undo stack
- The redo stack is cleared (new action breaks the redo chain)

### Memory Management

History is limited to prevent memory bloat:
- Default max history: 50 items
- Configurable via `maxHistory` option
- Oldest items are discarded when limit is reached

### Keyboard Shortcuts

Keyboard shortcuts are automatically enabled by default but can be disabled:

```typescript
const undoRedo = useUndoRedo('', {
  enableKeyboardShortcuts: false,
})
```

## Best Practices

### 1. Validation

Always validate expressions before setting them:

```typescript
const editor = useExpressionEditor({
  validator: (expr) => {
    return validateExpression(expr) && isValidMath(expr)
  },
})
```

### 2. Memory Limits

Set appropriate history limits based on your use case:

```typescript
// For a simple text input
useUndoRedo('', { maxHistory: 20 })

// For a complex editor
useUndoRedo('', { maxHistory: 100 })
```

### 3. Callbacks

Use callbacks for side effects:

```typescript
useUndoRedo('', {
  onChange: (value, action) => {
    console.log(`${action}: ${value}`)
    analyticsTracker.event('undo_redo', { action })
  },
})
```

### 4. Error Handling

Handle clipboard operations carefully:

```typescript
try {
  await editor.copy()
  showNotification('Copied to clipboard')
} catch (err) {
  console.error('Copy failed:', err)
  showNotification('Failed to copy')
}
```

## Examples

### Basic Text Input with Undo/Redo

```typescript
function SimpleInput() {
  const undoRedo = useUndoRedo('')

  return (
    <div>
      <input
        value={undoRedo.value}
        onChange={(e) => undoRedo.setValue(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={undoRedo.undo} disabled={!undoRedo.canUndo}>
        ↶ Undo
      </button>
      <button onClick={undoRedo.redo} disabled={!undoRedo.canRedo}>
        ↷ Redo
      </button>
    </div>
  )
}
```

### Expression Editor with Validation

```typescript
function SmartExpressionEditor() {
  const editor = useExpressionEditor({
    initialExpression: '',
    validator: (expr) => {
      // Your validation logic
      return validateExpression(expr)
    },
    onExpressionChange: (expr) => {
      // Update calculation or preview
      calculateResult(expr)
    },
  })

  return (
    <div>
      <textarea
        value={editor.expression}
        onChange={(e) => editor.setExpression(e.target.value)}
      />
      {!editor.isValid && <span className="error">Invalid expression</span>}
      <div>
        <button onClick={editor.undo} disabled={editor.undoCount === 0}>
          Undo ({editor.undoCount})
        </button>
        <button onClick={editor.redo} disabled={editor.redoCount === 0}>
          Redo ({editor.redoCount})
        </button>
      </div>
    </div>
  )
}
```

### Calculator with History

```typescript
function Calculator() {
  const [expressions, setExpressions] = useState<string[]>([])
  const editor = useExpressionEditor()

  const handleCalculate = () => {
    const result = evaluateExpression(editor.expression)
    setExpressions([...expressions, `${editor.expression} = ${result}`])
    editor.clear()
  }

  return (
    <div>
      <AdvancedExpressionEditor
        initialValue={editor.expression}
        onChange={(expr) => editor.setExpression(expr)}
      />
      <button onClick={handleCalculate}>Calculate</button>
      <div className="history">
        {expressions.map((expr, i) => (
          <div key={i}>{expr}</div>
        ))}
      </div>
    </div>
  )
}
```

## Performance Considerations

- Undo/redo operations are O(1) - constant time
- History is bounded, preventing unbounded memory growth
- Keyboard event listeners use passive event handlers
- State updates are batched by React
- No unnecessary re-renders occur

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Keyboard shortcuts work on Mac and Windows
- Clipboard API support required for copy/paste
- Tested on Node 18+

## Testing

The hooks are designed to be easily testable:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useUndoRedo } from '@/hooks'

test('undo and redo work correctly', () => {
  const { result } = renderHook(() => useUndoRedo('initial'))

  act(() => {
    result.current.setValue('modified')
  })
  expect(result.current.value).toBe('modified')

  act(() => {
    result.current.undo()
  })
  expect(result.current.value).toBe('initial')

  act(() => {
    result.current.redo()
  })
  expect(result.current.value).toBe('modified')
})
```

## Troubleshooting

### Undo not working
- Check if `enableKeyboardShortcuts` is true (default)
- Verify `undoStack` has items via `undoCount`
- Ensure you're calling `setValue` to record changes

### History growing too large
- Reduce `maxHistory` option
- Check for unintended state updates

### Cursor position lost after undo
- Use `ExpressionEditorState.cursorPosition` to restore position
- `useExpressionEditor` handles this automatically

## Future Enhancements

- [ ] Persistent history (localStorage/IndexedDB)
- [ ] Collaborative undo/redo
- [ ] Undo/redo branching
- [ ] History visualization
- [ ] Macro recording
