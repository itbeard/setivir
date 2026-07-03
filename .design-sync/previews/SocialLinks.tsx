import { SocialLinks } from 'setivir'

// A centered row of brand/social icon links (Instagram, YouTube, YouTube
// Music, Spotify, Apple Music). The component fixes its own icon size (~22px,
// var(--ink-soft)); each link turns red on hover. One clean cell — an accent
// variant is a no-op because .link sets its own colour.
export function Default() {
  return (
    <div style={{ padding: '56px 32px', display: 'flex', justifyContent: 'center' }}>
      <SocialLinks />
    </div>
  )
}
