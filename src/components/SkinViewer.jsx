import React, { useEffect, useRef, useState } from 'react'

let sv3d = null
async function loadLib() {
  if (!sv3d) sv3d = await import('skinview3d')
  return sv3d
}

export default function SkinViewer({ skinFile, capeFile, geometry }) {
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadLib().then(lib => {
      if (!active || !canvasRef.current) return
      try {
        const viewer = new lib.SkinViewer({ canvas: canvasRef.current, width: 160, height: 210 })
        viewer.controls.enableRotate = true
        viewer.controls.enableZoom = false
        viewer.controls.enablePan = false
        viewer.autoRotate = true
        viewer.autoRotateSpeed = 0.7
        viewer.animation = new lib.IdleAnimation()
        viewer.animation.speed = 0.5
        viewer.renderer.setClearColor(0x000000, 0)
        viewerRef.current = viewer
        setReady(true)
      } catch (e) { console.warn('viewer init:', e) }
    })
    return () => {
      active = false
      if (viewerRef.current) { viewerRef.current.dispose(); viewerRef.current = null }
    }
  }, [])

  useEffect(() => {
  const v = viewerRef.current
  if (!v || !ready) return
  if (skinFile) {
    const url = URL.createObjectURL(skinFile)
    v.loadSkin(url, { model: geometry === 'slim' ? 'slim' : 'default' })
      .finally(() => URL.revokeObjectURL(url))
  } else {
    // Render a solid gray default skin
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#888888'
    ctx.fillRect(0, 0, 64, 64)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      v.loadSkin(url, { model: geometry === 'slim' ? 'slim' : 'default' })
        .finally(() => URL.revokeObjectURL(url))
    })
  }
}, [skinFile, geometry, ready])

  useEffect(() => {
    const v = viewerRef.current
    if (!v || !ready) return
    if (capeFile) {
      const url = URL.createObjectURL(capeFile)
      v.loadCape(url).finally(() => URL.revokeObjectURL(url))
    } else {
      try { v.loadCape(null) } catch(e) {}
    }
  }, [capeFile, ready])

  return (
    <div className="viewer-area">
      <canvas ref={canvasRef} style={{ display:'block' }} />
      <canvas ref={canvasRef} style={{ display:'block', opacity: skinFile ? 1 : 0, transition:'opacity .3s' }} />
    </div>
  )
}
