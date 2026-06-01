const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

function crc32(buf) {
  let c = 0xffffffff
  const table = []
  for (let n = 0; n < 256; n++) {
    let v = n
    for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1
    table[n] = v
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crcVal = crc32(typeData)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crcVal, 0)
  return Buffer.concat([len, typeData, crcBuf])
}

function generatePNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rawData = []
  for (let y = 0; y < height; y++) {
    rawData.push(0)
    for (let x = 0; x < width; x++) {
      const cx = x / width
      const cy = y / height
      const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2)
      const angle = Math.atan2(cy - 0.5, cx - 0.5)
      const wave = Math.sin(angle * 3 + dist * 6) * 0.3 + 0.7
      const r = Math.round((80 + wave * 90) * (1 - dist * 0.6))
      const g = Math.round((60 + wave * 80) * (1 - dist * 0.5))
      const b = Math.round((200 + wave * 55) * (1 - dist * 0.3))
      rawData.push(r, g, b, 255)
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawData))
  const idat = chunk('IDAT', compressed)
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend])
}

const png = generatePNG(1024, 1024)
const outPath = path.join(__dirname, '..', 'public', 'icon.png')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, png)
console.log('Icon generated: ' + outPath + ' (' + png.length + ' bytes)')
