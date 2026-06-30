import { useI18n } from '../i18n/I18nContext'
import {
  InstagramIcon,
  YouTubeIcon,
  YouTubeMusicIcon,
  SpotifyIcon,
  AppleMusicIcon,
} from './icons'
import styles from './SocialLinks.module.css'

/**
 * Where to find Setivir. Replace each `href` with the real profile/channel URL.
 *
 * ⚠ Only Instagram is a confirmed link. The other four currently point at a
 *   platform search for "Setivir" as a placeholder — swap them for the exact
 *   profile URLs once you have them.
 */
const LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/iamsetivir/', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@ciomnylos/releases', Icon: YouTubeIcon },
  { label: 'YouTube Music', href: 'https://music.youtube.com/@ciomnylos', Icon: YouTubeMusicIcon },
  { label: 'Spotify', href: 'https://open.spotify.com/artist/1sod93alm6QTbGrqQ0GzR', Icon: SpotifyIcon },
  { label: 'Apple Music', href: 'https://music.apple.com/gb/artist/setivir/1832852251', Icon: AppleMusicIcon },
]

export function SocialLinks() {
  const { t } = useI18n()
  return (
    <nav className={styles.row} aria-label={t('social.aria')}>
      {LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          className={styles.link}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </nav>
  )
}
