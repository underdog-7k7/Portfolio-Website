import { create } from 'zustand'

export type Overlay =
  | { kind: 'skills'; categoryId: string }
  | { kind: 'project'; projectId: string }
  | { kind: 'contact' }
  | { kind: 'jukebox' }
  | { kind: 'agent' }
  | { kind: 'idea' }
  | { kind: 'laptop' }
  | { kind: 'tv' }
  | { kind: 'current' }
  | { kind: 'journey' }
  | { kind: 'telescope' }
  | { kind: 'trivia' }
  | { kind: 'github' }
  | { kind: 'fortune' }
  | { kind: 'cards' }
  | { kind: 'joke' }

/** overlays that need a free cursor (forms, buttons, links) */
const NEEDS_CURSOR: Overlay['kind'][] = [
  'contact',
  'jukebox',
  'agent',
  'idea',
  'laptop',
  'tv',
  'current',
  'telescope',
  'trivia',
  'github',
  'fortune',
  'cards',
  'joke',
]
/** overlays tied to a camera focus — closing them flies the camera back */
const FOCUS_KINDS: Overlay['kind'][] = ['laptop', 'tv']
/** overlays with text inputs — WASD must not move the player while typing */
export const TYPING_KINDS: Overlay['kind'][] = ['contact', 'agent', 'idea', 'laptop']

export interface NearAction {
  id: string
  label: string
  open: () => void
}

/** camera focus target (e.g. zooming into the laptop screen) */
export interface FocusTarget {
  pos: [number, number, number]
  look: [number, number, number]
  /** overlay to open once the camera arrives */
  overlay?: Overlay
}

interface AppState {
  /** user pressed "Step Inside" after assets loaded */
  started: boolean
  isTouch: boolean
  overlay: Overlay | null
  /** interactable id that opened the current overlay (for auto-close on walk-away) */
  overlaySource: string | null
  near: NearAction | null
  room: string
  focus: FocusTarget | null
  /** true while the camera rig is animating (controls stay hands-off) */
  cameraBusy: boolean
  start: () => void
  setTouch: (v: boolean) => void
  openOverlay: (o: Overlay, source?: string) => void
  closeOverlay: () => void
  setNear: (n: NearAction | null) => void
  setRoom: (r: string) => void
  setFocus: (f: FocusTarget | null) => void
  setCameraBusy: (v: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  started: false,
  isTouch: false,
  overlay: null,
  overlaySource: null,
  near: null,
  room: 'hall',
  focus: null,
  cameraBusy: false,
  start: () => set({ started: true }),
  setTouch: (v) => set({ isTouch: v }),
  openOverlay: (o, source) => {
    set({ overlay: o, overlaySource: source ?? null })
    if (NEEDS_CURSOR.includes(o.kind)) document.exitPointerLock?.()
  },
  closeOverlay: () => {
    const kind = get().overlay?.kind
    set({ overlay: null, overlaySource: null })
    // leaving a zoomed-in screen also releases the camera
    if (kind && FOCUS_KINDS.includes(kind)) set({ focus: null })
  },
  setNear: (n) => set({ near: n }),
  setRoom: (r) => set({ room: r }),
  setFocus: (f) => {
    set({ focus: f })
    if (f) {
      set({ cameraBusy: true })
      document.exitPointerLock?.()
    }
  },
  setCameraBusy: (v) => set({ cameraBusy: v }),
}))
