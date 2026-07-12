import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n/I18nContext'
import { useModalDialog } from '../hooks/useModalDialog'
import styles from './ImageLightbox.module.css'

/**
 * Lightbox for photos embedded in Markdown prose: the picture on a dark
 * scrim at the largest size that fits, with free zoom and pan so details
 * can be examined.
 *
 *   - mouse wheel / trackpad     — zoom towards the cursor
 *   - pinch (two pointers)       — zoom towards the pinch midpoint
 *   - double click / double tap  — toggle between fit and 2.5×
 *   - drag (when zoomed)         — pan; arrows do the same from the keyboard
 *   - + / − / 0 keys and the round buttons — step zoom / reset
 *
 * Clicking the empty stage (not the photo) closes, as does Esc / the ✕
 * button; modal a11y (focus trap, scroll lock) comes from useModalDialog.
 * The transform is applied to the <img> itself; the entry animation lives
 * on the stage so the two never fight.
 */

const MIN_SCALE = 1
const MAX_SCALE = 6
const TAP_SCALE = 2.5
const STEP = 1.5
const ARROW_PAN = 80

interface Transform {
  scale: number
  x: number
  y: number
}

const FIT: Transform = { scale: 1, x: 0, y: 0 }

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export function ImageLightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string
  alt: string
  /** Already-rendered caption nodes (the alt text may carry inline Markdown). */
  caption?: ReactNode
  onClose: () => void
}) {
  const { t } = useI18n()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [{ scale, x, y }, setT] = useState<Transform>(FIT)
  // Discrete jumps (double click, buttons, keys) animate; continuous gestures
  // (wheel, pinch, drag) must track the pointer instantly.
  const [smooth, setSmooth] = useState(false)

  useModalDialog(overlayRef, onClose)

  /** Keep the picture from being panned fully off-screen: once an axis fits
      inside the stage it stays centred, otherwise its edges stop at the
      stage edges. offsetWidth/Height are the untransformed layout size, so
      the maths is independent of the current scale transform. */
  const clampTransform = (next: Transform): Transform => {
    const stage = stageRef.current
    const img = imgRef.current
    const s = clampScale(next.scale)
    if (!stage || !img) return { scale: s, x: next.x, y: next.y }
    const maxX = Math.max(0, (img.offsetWidth * s - stage.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * s - stage.clientHeight) / 2)
    return {
      scale: s,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }

  /** New transform that zooms to `targetScale` keeping the image point under
      the given viewport coordinates stationary. */
  const zoomedTransform = (
    prev: Transform,
    clientX: number,
    clientY: number,
    targetScale: number,
  ): Transform => {
    const stage = stageRef.current
    if (!stage) return prev
    const s = clampScale(targetScale)
    const rect = stage.getBoundingClientRect()
    const px = clientX - rect.left - rect.width / 2
    const py = clientY - rect.top - rect.height / 2
    const k = s / prev.scale
    return clampTransform({ scale: s, x: px - (px - prev.x) * k, y: py - (py - prev.y) * k })
  }

  const zoomStep = (factor: number) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    setSmooth(true)
    setT((prev) =>
      zoomedTransform(prev, rect.left + rect.width / 2, rect.top + rect.height / 2, prev.scale * factor),
    )
  }

  const reset = () => {
    setSmooth(true)
    setT(FIT)
  }

  const toggleZoom = (clientX: number, clientY: number) => {
    setSmooth(true)
    setT((prev) => (prev.scale > 1.01 ? FIT : zoomedTransform(prev, clientX, clientY, TAP_SCALE)))
  }

  /* ── Pointer gestures: drag to pan, two pointers to pinch ───────────── */

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const movedRef = useRef(false)
  const downRef = useRef({ x: 0, y: 0 })
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 })
  // A handled double tap must not be doubled by a browser-synthesised dblclick.
  const suppressDblRef = useRef(0)

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    stageRef.current?.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      movedRef.current = false
      downRef.current = { x: e.clientX, y: e.clientY }
    } else {
      // A pinch is never a tap/click.
      movedRef.current = true
    }
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    const entry = pointers.current.get(e.pointerId)
    if (!entry) return
    const prevPos = { x: entry.x, y: entry.y }

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const other = a === entry ? b : a
      const prevDist = Math.hypot(prevPos.x - other.x, prevPos.y - other.y)
      const prevMid = { x: (prevPos.x + other.x) / 2, y: (prevPos.y + other.y) / 2 }
      const newDist = Math.hypot(e.clientX - other.x, e.clientY - other.y)
      const newMid = { x: (e.clientX + other.x) / 2, y: (e.clientY + other.y) / 2 }
      entry.x = e.clientX
      entry.y = e.clientY
      if (prevDist > 0) {
        setSmooth(false)
        setT((prev) => {
          const zoomed = zoomedTransform(prev, prevMid.x, prevMid.y, prev.scale * (newDist / prevDist))
          // The pinch midpoint also drags the picture along with it.
          return clampTransform({
            scale: zoomed.scale,
            x: zoomed.x + newMid.x - prevMid.x,
            y: zoomed.y + newMid.y - prevMid.y,
          })
        })
      }
      return
    }

    const dx = e.clientX - entry.x
    const dy = e.clientY - entry.y
    entry.x = e.clientX
    entry.y = e.clientY
    if (
      !movedRef.current &&
      Math.hypot(e.clientX - downRef.current.x, e.clientY - downRef.current.y) > 6
    ) {
      movedRef.current = true
    }
    if (dx || dy) {
      setSmooth(false)
      setT((prev) => (prev.scale > 1 ? clampTransform({ ...prev, x: prev.x + dx, y: prev.y + dy }) : prev))
    }
  }

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!pointers.current.delete(e.pointerId)) return
    // Manual double-tap detection: iOS doesn't reliably synthesise dblclick
    // once touch-action is disabled.
    if (e.pointerType === 'touch' && pointers.current.size === 0 && !movedRef.current) {
      const now = performance.now()
      const last = lastTapRef.current
      if (now - last.time < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 40) {
        lastTapRef.current = { time: 0, x: 0, y: 0 }
        suppressDblRef.current = now
        toggleZoom(e.clientX, e.clientY)
      } else {
        lastTapRef.current = { time: now, x: e.clientX, y: e.clientY }
      }
    }
  }

  const onPointerCancel = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId)
  }

  const onDoubleClick = (e: ReactMouseEvent) => {
    if (performance.now() - suppressDblRef.current < 500) return
    toggleZoom(e.clientX, e.clientY)
  }

  /** A clean click (no drag) on the empty stage closes the lightbox. Hit-test
      by coordinates, not e.target: pointer capture on the stage retargets the
      synthesised click there even when the press was on the photo. */
  const onStageClick = (e: ReactMouseEvent) => {
    if (movedRef.current) return
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    const onImage =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
    if (!onImage) onClose()
  }

  /* ── Wheel zoom & housekeeping (native listeners) ────────────────────── */

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    // React registers wheel handlers passively — preventDefault (needed to
    // swallow browser page-zoom on pinch-trackpads) requires a native one.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      setSmooth(false)
      setT((prev) => zoomedTransform(prev, e.clientX, e.clientY, prev.scale * Math.exp(-dy * 0.002)))
    }
    // Safari's proprietary pinch events would otherwise zoom the whole page.
    const preventGesture = (e: Event) => e.preventDefault()
    const onResize = () => setT((prev) => clampTransform(prev))
    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('gesturestart', preventGesture)
    stage.addEventListener('gesturechange', preventGesture)
    window.addEventListener('resize', onResize)
    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('gesturestart', preventGesture)
      stage.removeEventListener('gesturechange', preventGesture)
      window.removeEventListener('resize', onResize)
    }
    // zoomedTransform/clampTransform only read refs, so the first render's
    // closures stay correct for the lifetime of the dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Keyboard: step zoom and pan (Esc/Tab live in useModalDialog) ────── */

  const panBy = (dx: number, dy: number) => {
    setSmooth(true)
    setT((prev) => (prev.scale > 1 ? clampTransform({ ...prev, x: prev.x + dx, y: prev.y + dy }) : prev))
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === '+' || e.key === '=') zoomStep(STEP)
    else if (e.key === '-' || e.key === '_') zoomStep(1 / STEP)
    else if (e.key === '0') reset()
    else if (e.key === 'ArrowLeft') panBy(ARROW_PAN, 0)
    else if (e.key === 'ArrowRight') panBy(-ARROW_PAN, 0)
    else if (e.key === 'ArrowUp') panBy(0, ARROW_PAN)
    else if (e.key === 'ArrowDown') panBy(0, -ARROW_PAN)
    else return
    e.preventDefault()
  }

  const zoomed = scale > 1.001

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={alt || t('md.enlarge')}
      onKeyDown={onKeyDown}
    >
      <div className={styles.scrim} />
      <div
        ref={stageRef}
        className={styles.stage}
        data-zoomed={zoomed || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={onStageClick}
        onDoubleClick={onDoubleClick}
      >
        <img
          ref={imgRef}
          className={styles.img}
          src={src}
          alt={alt}
          draggable={false}
          data-smooth={smooth || undefined}
          style={{ transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }}
        />
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label={t('dialog.close')}
        title={t('dialog.close')}
      >
        ✕
      </button>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => zoomStep(1 / STEP)}
          aria-disabled={!zoomed}
          aria-label={t('lightbox.zoomOut')}
          title={t('lightbox.zoomOut')}
        >
          −
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnReset}`}
          onClick={reset}
          aria-disabled={!zoomed}
          aria-label={t('lightbox.zoomReset')}
          title={t('lightbox.zoomReset')}
        >
          1×
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => zoomStep(STEP)}
          aria-disabled={scale >= MAX_SCALE - 0.001}
          aria-label={t('lightbox.zoomIn')}
          title={t('lightbox.zoomIn')}
        >
          +
        </button>
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>,
    document.body,
  )
}
