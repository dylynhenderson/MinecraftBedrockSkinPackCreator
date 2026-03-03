import React, { useRef } from 'react'
import SkinViewer from './SkinViewer'
import ColorPicker from './ColorPicker'
import { parseFormatted, segmentToStyle } from '../utils/formatText'

export default function SkinCard({ skin, index, onChange, onRemove }) {
  const skinInputRef = useRef(null)
  const capeInputRef = useRef(null)
  const nameInputRef = useRef(null)

  function handleSkinFile(e) {
    const file = e.target.files[0]
    if (file) onChange({ ...skin, skinFile: file })
    e.target.value = ''
  }

  function handleCapeFile(e) {
    const file = e.target.files[0]
    if (file) onChange({ ...skin, capeFile: file })
    e.target.value = ''
  }

  const segments = parseFormatted(skin.name || '')

  return (
    <div className="skin-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span className="skin-card-num">SKIN #{index + 1}</span>
        <button className="skin-card-remove" onClick={onRemove} type="button" title="Remove skin">x</button>
      </div>

      <SkinViewer skinFile={skin.skinFile} capeFile={skin.capeFile} geometry={skin.geometry} />

      <div className="upload-row">
        <input ref={skinInputRef} type="file" accept=".png" style={{ display:'none' }} onChange={handleSkinFile} />
        <button
          className={'upload-btn' + (skin.skinFile ? ' has-file' : '')}
          onClick={() => skinInputRef.current && skinInputRef.current.click()}
          type="button"
        >
          {skin.skinFile ? skin.skinFile.name : '+ Skin PNG'}
        </button>
        <input ref={capeInputRef} type="file" accept=".png" style={{ display:'none' }} onChange={handleCapeFile} />
        <button
          className={'upload-btn cape' + (skin.capeFile ? ' has-file' : '')}
          onClick={() => capeInputRef.current && capeInputRef.current.click()}
          type="button"
        >
          {skin.capeFile ? skin.capeFile.name : '+ Cape PNG'}
        </button>
      </div>

      <div className="geometry-toggle" role="group" aria-label="Arm width">
        <button
          className={'geo-btn' + (skin.geometry !== 'slim' ? ' active' : '')}
          onClick={() => onChange({ ...skin, geometry: 'normal' })}
          type="button"
        >Normal (4px)</button>
        <button
          className={'geo-btn' + (skin.geometry === 'slim' ? ' active' : '')}
          onClick={() => onChange({ ...skin, geometry: 'slim' })}
          type="button"
        >Slim (3px)</button>
      </div>

      <div>
        <input
          ref={nameInputRef}
          className="mc-input"
          type="text"
          placeholder="Enter skin name..."
          value={skin.name}
          onChange={e => onChange({ ...skin, name: e.target.value })}
        />
        <div className="name-preview" aria-label="Formatted name preview">
          {segments.length === 0
            ? <span className="name-preview-empty">Preview...</span>
            : segments.map((seg, i) => <span key={i} style={segmentToStyle(seg)}>{seg.text}</span>)
          }
        </div>
        <ColorPicker
          inputRef={nameInputRef}
          value={skin.name}
          onChange={v => onChange({ ...skin, name: v })}
        />
      </div>
    </div>
  )
}
