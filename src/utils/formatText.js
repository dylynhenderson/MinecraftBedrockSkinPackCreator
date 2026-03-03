
const COLOR_MAP = {
  '0':'#000000','1':'#0000AA','2':'#00AA00','3':'#00AAAA',
  '4':'#AA0000','5':'#AA00AA','6':'#FFAA00','7':'#AAAAAA',
  '8':'#555555','9':'#5555FF','a':'#55FF55','b':'#55FFFF',
  'c':'#FF5555','d':'#FF55FF','e':'#FFFF55','f':'#FFFFFF',
}

export function parseFormatted(raw) {
  const segments = []
  let i = 0
  let cur = { text:'', color:'#FFFFFF', bold:false, italic:false, underline:false, strike:false }
  while (i < raw.length) {
    if (raw[i] === '§' && i + 1 < raw.length) {
      const code = raw[i+1].toLowerCase()
      if (cur.text) { segments.push({...cur}); cur = {...cur, text:''} }
      if (COLOR_MAP[code]) {
        cur.color = COLOR_MAP[code]
        cur.bold = false; cur.italic = false; cur.underline = false; cur.strike = false
      } else if (code === 'l') { cur.bold = true }
      else if (code === 'o') { cur.italic = true }
      else if (code === 'n') { cur.underline = true }
      else if (code === 'm') { cur.strike = true }
      else if (code === 'r') {
        cur = { text:'', color:'#FFFFFF', bold:false, italic:false, underline:false, strike:false }
      }
      i += 2
    } else {
      cur.text += raw[i]; i++
    }
  }
  if (cur.text) segments.push(cur)
  return segments
}

export function segmentToStyle(seg) {
  return {
    color: seg.color,
    fontWeight: seg.bold ? 'bold' : 'normal',
    fontStyle: seg.italic ? 'italic' : 'normal',
    textDecoration: [seg.underline && 'underline', seg.strike && 'line-through'].filter(Boolean).join(' ') || 'none',
  }
}
