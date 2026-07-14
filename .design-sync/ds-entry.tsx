// Design-system entry for claude.ai/design (design-sync converter).
//
// Re-exports Setivir's real components plus the two context providers they
// depend on (I18nProvider / PlayerProvider — wired as cfg.provider), and pulls
// in the design tokens (theme.css) and base styles (base.css) so the compiled
// _ds_bundle.css carries the site's look. Deliberately NOT re-exported:
// main.tsx (mounts the app via ReactDOM — would run at bundle eval) and App.tsx
// (the full page shell). This barrel is the --entry the converter bundles.
import '../src/styles/theme.css'
import './base.css'

// Context providers — on window.Setivir so previews can wrap in them.
// The hooks are exported too so preview harnesses can seed player/i18n state
// through the SAME module instance the providers use (importing them from
// source would create a second React context and break provider identity).
export { I18nProvider, useI18n } from '../src/i18n/I18nContext'
export { PlayerProvider, usePlayer } from '../src/audio/PlayerContext'

// Components.
export { Hero } from '../src/components/Hero'
export { TopBar } from '../src/components/TopBar'
export { ProgressNav } from '../src/components/ProgressNav'
export { SongScreen } from '../src/components/SongScreen'
export { SongMeta } from '../src/components/SongMeta'
export { PlayButton } from '../src/components/PlayButton'
export { MiniPlayer } from '../src/components/MiniPlayer'
// Cover visualizers — CoverViz dispatches per song.visualizer; the four
// concrete visualizers are the site's beat-reactive cover art layer.
export { CoverViz } from '../src/components/visualizers/CoverViz'
export { EmbersViz } from '../src/components/visualizers/EmbersViz'
export { LightningViz } from '../src/components/visualizers/LightningViz'
export { BarsViz } from '../src/components/visualizers/BarsViz'
export { OrionViz } from '../src/components/visualizers/OrionViz'
export { PromptDisclosure } from '../src/components/PromptDisclosure'
export { SocialLinks } from '../src/components/SocialLinks'
export { Outro } from '../src/components/Outro'
export { Ornament } from '../src/components/Ornament'
