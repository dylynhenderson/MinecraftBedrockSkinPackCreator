import React, { useRef, useState, useCallback } from 'react'
import SkinCard from './components/SkinCard'
import ColorPicker from './components/ColorPicker'
import { buildAndDownload } from './utils/packBuilder'
import { parseFormatted, segmentToStyle } from './utils/formatText'

const MAX_SKINS = 100

function newSkin() {
  return { id: crypto.randomUUID(), name: '', geometry: 'normal', skinFile: null, capeFile: null }
}

export default function App() {
  const [packName, setPackName] = useState('')
  const [skins, setSkins] = useState([newSkin()])
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const packNameRef = useRef(null)

  const showToast = useCallback((msg, err = false) => {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const addSkin = () => {
    if (skins.length >= MAX_SKINS) return showToast('Maximum 100 skins reached.')
    setSkins(p => [...p, newSkin()])
  }

  const removeSkin = id => setSkins(p => p.filter(s => s.id !== id))
  const updateSkin = (id, updated) => setSkins(p => p.map(s => s.id === id ? { ...updated, id } : s))

  const handleGenerate = async () => {
    if (busy) return
    setBusy(true)
    try {
      const filename = await buildAndDownload(packName, skins)
      showToast('Downloaded: ' + filename)
    } catch (e) {
      showToast(e.message || 'Something went wrong.', true)
    } finally {
      setBusy(false)
    }
  }

  const packSegs = parseFormatted(packName)

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">Dylan's Minecraft Bedrock Skin Pack Creator</h1>
        <p className="app-subtitle">No account, download, or payment required!</p>
      </header>

      <section className="pack-name-section" aria-labelledby="pn-label">
        <div className="section-label" id="pn-label">Pack Name</div>
        <input
          ref={packNameRef}
          className="mc-input"
          type="text"
          placeholder="Enter pack name..."
          value={packName}
          onChange={e => setPackName(e.target.value)}
          maxLength={64}
          aria-label="Pack name"
        />
        <div className="name-preview" aria-label="Pack name preview">
          {packSegs.length === 0
            ? <span className="name-preview-empty">preview...</span>
            : packSegs.map((seg, i) => <span key={i} style={segmentToStyle(seg)}>{seg.text}</span>)
          }
        </div>
        <ColorPicker inputRef={packNameRef} value={packName} onChange={setPackName} />
      </section>

      <div className="skins-header">
        <div className="section-label" style={{ marginBottom: 0 }}>Skins</div>
        <span className="skin-count">{skins.length} / {MAX_SKINS}</span>
      </div>

      <div className="skins-grid">
        {skins.map((skin, i) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            index={i}
            onChange={u => updateSkin(skin.id, u)}
            onRemove={() => removeSkin(skin.id)}
          />
        ))}
      </div>

      <button
        className="add-skin-btn"
        onClick={addSkin}
        disabled={skins.length >= MAX_SKINS}
        type="button"
      >
        <span style={{ fontSize:22, fontFamily:'var(--pixel)', marginRight:4 }}>+</span>
        Add Skin Slot {skins.length >= MAX_SKINS ? '(limit reached)' : ''}
      </button>

      <div className="generate-section">
        <button className="generate-btn" onClick={handleGenerate} disabled={busy} type="button">
          {busy ? 'Building...' : 'Build & Download .mcpack'}
        </button>
        <p className="generate-hint">
          Skins without a PNG uploaded will be skipped.
          Capes require special implementation.
        </p>
      </div>

      <footer className="app-footer">
        <a href="https://github.com/dylynhenderson" target="_blank" rel="noreferrer" style={{ color:'var(--grass)', display:'inline-flex', alignItems:'center', gap:'8px' }}>
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          dylynhenderson
        </a>
      </footer>

      {toast && (
        <div className={'toast' + (toast.err ? ' error' : '')} role="alert" aria-live="assertive">
          {toast.msg}
        </div>
      )}
    </div>
  )
}
