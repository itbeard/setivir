import type { Localized } from '../types'

export const ui = {
  'site.tagline': {
    be: 'Музыка Тутэйшых',
    en: 'Songs of the Tuteyshya',
  },
  'social.aria': {
    be: 'Слухаць і сачыць за Setivir',
    en: 'Listen to and follow Setivir',
  },
  'hero.enter': {
    be: 'Слухаць',
    en: 'Start listening',
  },
  'nav.next': {
    be: 'Наступная',
    en: 'Next',
  },
  'nav.prev': {
    be: 'Папярэдняя',
    en: 'Previous',
  },
  'card.nextSong': {
    be: 'Наступная песьня',
    en: 'Next song',
  },
  'player.play': {
    be: 'Граць',
    en: 'Play',
  },
  'player.pause': {
    be: 'Паўза',
    en: 'Pause',
  },
  'player.nowPlaying': {
    be: 'Цяпер грае',
    en: 'Now playing',
  },
  'player.loading': {
    be: 'Загружаецца…',
    en: 'Loading…',
  },
  'player.close': {
    be: 'Зачыніць плэер',
    en: 'Close player',
  },
  'player.seek': {
    be: 'Перамотка',
    en: 'Seek',
  },
  'meta.model': {
    be: 'Мадэль',
    en: 'Model',
  },
  'meta.author': {
    be: 'Аўтар тэксту',
    en: 'Lyrics by',
  },
  'meta.date': {
    be: 'Апублікавана',
    en: 'Released',
  },
  'meta.song': {
    be: 'Песьня',
    en: 'Song',
  },
  'prompt.style': {
    be: 'Промпт стылю',
    en: 'Style prompt',
  },
  'prompt.lyrics': {
    be: 'Промпт тэксту',
    en: 'Lyrics prompt',
  },
  'lyrics.label': {
    be: 'Тэкст песьні',
    en: 'Lyrics',
  },
  'lyrics.translationNote': {
    be: 'Пераклад, набліжаны па сэнсе да арыгіналу.',
    en: 'A translation that conveys the approximate meaning of the original.',
  },
  'a11y.skip': {
    be: 'Перайсьці да зьместу',
    en: 'Skip to content',
  },
  'a11y.langBe': {
    be: 'Беларуская мова',
    en: 'Belarusian',
  },
  'a11y.langEn': {
    be: 'Ангельская мова',
    en: 'English',
  },
  'outro.heading': {
    be: 'Дзякуй, што слухаеце',
    en: 'Thank you for listening',
  },
  'outro.follow': {
    be: 'Сачыць у Instagram',
    en: 'Follow on Instagram',
  },
  'outro.backTop': {
    be: 'Угару',
    en: 'Back to top',
  },
  'a11y.openMenu': {
    be: 'Сьпіс песень',
    en: 'Song list',
  },
  'song.downloadShort': {
    be: 'Спампаваць',
    en: 'Download',
  },
  'song.copyLink': {
    be: 'Скапіяваць спасылку',
    en: 'Copy link',
  },
  'song.linkCopied': {
    be: 'Спасылка скапіявана',
    en: 'Link copied',
  },
  'song.viewCover': {
    be: 'Павялічыць вокладку',
    en: 'Enlarge cover',
  },
  'sheet.intro': {
    be: 'Уступ',
    en: 'Intro',
  },
  'sheet.outro': {
    be: 'Фінал',
    en: 'Finale',
  },
  'dialog.close': {
    be: 'Зачыніць',
    en: 'Close',
  },
} satisfies Record<string, Localized>

export type UiKey = keyof typeof ui
