/**
 * Makes the repo-root media folders available to Vite by linking them into
 * public/. Vite only serves/copies what lives under public/, so without this
 * a fresh clone (where public/songs & public/thumbnails are git-ignored) would
 * build a site with no audio and no covers.
 *
 * Runs automatically before `dev` and `build` (see package.json). Cross-platform:
 * uses a directory symlink/junction, and falls back to copying if linking is
 * not permitted (e.g. Windows without developer mode).
 */
import {
  existsSync,
  lstatSync,
  rmSync,
  symlinkSync,
  cpSync,
} from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

for (const name of ['songs', 'thumbnails']) {
  const target = resolve(root, name)
  const link = resolve(root, 'public', name)

  if (!existsSync(target)) {
    console.warn(`[link-assets] source "${name}/" not found — skipping`)
    continue
  }

  // Remove any existing link/dir/file at the destination.
  if (existsSync(link) || isSymlink(link)) {
    rmSync(link, { recursive: true, force: true })
  }

  try {
    // 'junction' is honoured on Windows (no admin needed) and ignored on POSIX.
    symlinkSync(target, link, 'junction')
    console.log(`[link-assets] linked public/${name} -> ${name}`)
  } catch (err) {
    console.warn(`[link-assets] symlink failed (${err.code}); copying instead`)
    cpSync(target, link, { recursive: true })
  }
}

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}
