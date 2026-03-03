import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export function stripCodes(str = '') {
  return str.replace(/§./g, '').trim()
}

function toSerializeName(str = '') {
  const clean = stripCodes(str).replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64)
  return clean || 'CustomSkinPack'
}

export async function buildAndDownload(packNameDisplay, skins) {
  if (!skins || skins.length === 0) throw new Error('Add at least one skin before generating.')
  const validSkins = skins.filter(s => s.skinFile)
  if (validSkins.length === 0) throw new Error('Upload a PNG file for at least one skin slot.')

  const zip = new JSZip()
  const sn = toSerializeName(packNameDisplay) + '_' + Math.random().toString(36).slice(2, 7)

  zip.file('manifest.json', JSON.stringify({
    format_version: 2,
    header: {
      name: 'pack.name',
      description: "Created with dylynhenderson's Bedrock Skin Pack Creator",
      uuid: crypto.randomUUID(),
      version: [1, 0, 0],
    },
    modules: [{ type: 'skin_pack', uuid: crypto.randomUUID(), version: [1, 0, 0] }],
  }, null, 2))

  const skinsEntries = []
  const langLines = ['skinpack.' + sn + '=' + (packNameDisplay || 'Skin Pack')]
  let idx = 1

  for (const skin of skins) {
    if (!skin.skinFile) continue
    const textureName = 'skin' + idx + '.png'
    zip.file(textureName, await skin.skinFile.arrayBuffer())
    const skinLocName = 'skin' + idx
    const entry = {
      localization_name: skinLocName,
      geometry: skin.geometry === 'slim' ? 'geometry.humanoid.customSlim' : 'geometry.humanoid.custom',
      texture: textureName,
      type: 'free',
    }
    if (skin.capeFile) {
      const capeName = 'cape' + idx + '.png'
      zip.file(capeName, await skin.capeFile.arrayBuffer())
      entry.cape = capeName
    }
    skinsEntries.push(entry)
    langLines.push('skin.' + sn + '.' + skinLocName + '=' + (skin.name || 'Skin ' + idx))
    idx++
  }

  zip.file('skins.json', JSON.stringify({ skins: skinsEntries, serialize_name: sn, localization_name: sn }, null, 2))

  const textsFolder = zip.folder('texts')
  textsFolder.file('languages.json', JSON.stringify(['en_US'], null, 2))
  textsFolder.file('en_US.lang', langLines.join('\n') + '\n')

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
  const filename = sn + '.mcpack'
  saveAs(blob, filename)
  return filename
}
