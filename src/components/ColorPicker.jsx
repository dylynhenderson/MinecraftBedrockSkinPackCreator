import React from 'react'

const COLORS = [
  { code: '0', hex: '#000000', label: 'Black' },
  { code: '1', hex: '#0000AA', label: 'Dark Blue' },
  { code: '2', hex: '#00AA00', label: 'Dark Green' },
  { code: '3', hex: '#00AAAA', label: 'Dark Aqua' },
  { code: '4', hex: '#AA0000', label: 'Dark Red' },
  { code: '5', hex: '#AA00AA', label: 'Dark Purple' },
  { code: '6', hex: '#FFAA00', label: 'Gold' },
  { code: '7', hex: '#AAAAAA', label: 'Gray' },
  { code: '8', hex: '#555555', label: 'Dark Gray' },
  { code: '9', hex: '#5555FF', label: 'Blue' },
  { code: 'a', hex: '#55FF55', label: 'Green' },
  { code: 'b', hex: '#55FFFF', label: 'Aqua' },
  { code: 'c', hex: '#FF5555', label: 'Red' },
  { code: 'd', hex: '#FF55FF', label: 'Light Purple' },
  { code: 'e', hex: '#FFFF55', label: 'Yellow' },
  { code: 'f', hex: '#FFFFFF', label: 'White' },
]

const FORMATS = [
  { code: 'l', label: 'B', style: { fontWeight: 'bold' },              title: 'Bold' },
  { code: 'o', label: 'I', style: { fontStyle: 'italic' },             title: 'Italic' },
  { code: 'n', label: 'U', style: { textDecoration: 'underline' },     title: 'Underline' },
  { code: 'm', label: 'S', style: { textDecoration: 'line-through' },  title: 'Strikethrough' },
  { code: 'r', label: 'Reset', style: {},                              title: 'Reset formatting' },
]

function insertCode(inputRef, code, value, onChange) {
  const insertion = '\u00a7' + code
  const el = inputRef?.current
  if (el) {
    const start = el.selectionStart ?? value.length
    const end   = el.selectionEnd   ?? value.length
    const next  = value.slice(0, start) + insertion + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + 2, start + 2)
    })
  } else {
    onChange(value + insertion)
  }
}

export default function ColorPicker({ inputRef, value, onChange }) {
  return (
    <div className="color-picker" role="toolbar" aria-label="Minecraft text formatting">
      {COLORS.map(c => (
        <button
          key={c.code}
          className="color-btn"
          style={{ background: c.hex }}
          title={`${c.label} (\u00a7${c.code})`}
          onClick={() => insertCode(inputRef, c.code, value, onChange)}
          type="button"
          aria-label={c.label}
        />
      ))}
      <div className="color-sep" aria-hidden="true" />
      {FORMATS.map(f => (
        <button
          key={f.code}
          className="fmt-btn"
          style={f.style}
          title={f.title}
          onClick={() => insertCode(inputRef, f.code, value, onChange)}
          type="button"
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
