import sharp from 'sharp'
import { readdir, mkdir, copyFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const dir = 'public/thumbs/proyectos'
const backupDir = join(dir, '_original')
const MAX = 600

await mkdir(backupDir, { recursive: true })

const files = (await readdir(dir)).filter(f => extname(f).toLowerCase() === '.png')

for (const file of files) {
  const src = join(dir, file)
  const backup = join(backupDir, file)

  // backup original once
  try { await stat(backup) } catch { await copyFile(src, backup) }

  const before = (await stat(src)).size
  const buf = await sharp(backup)
    .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toBuffer()

  await sharp(buf).toFile(src)
  const after = (await stat(src)).size
  console.log(`${file}: ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e3).toFixed(0)}KB`)
}
