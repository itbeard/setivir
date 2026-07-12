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
  'md.showMore': {
    be: 'Паказаць больш',
    en: 'Show more',
  },
  'md.showVideo': {
    be: 'Паказаць відэа',
    en: 'Show video',
  },
  'md.showImage': {
    be: 'Паказаць відарыс',
    en: 'Show image',
  },
  'md.enlarge': {
    be: 'Павялічыць відарыс',
    en: 'Enlarge image',
  },
  'lightbox.zoomIn': {
    be: 'Наблізіць',
    en: 'Zoom in',
  },
  'lightbox.zoomOut': {
    be: 'Аддаліць',
    en: 'Zoom out',
  },
  'lightbox.zoomReset': {
    be: 'Зыходны маштаб',
    en: 'Reset zoom',
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
  'sort.label': {
    be: 'Парадак трэкаў',
    en: 'Track order',
  },
  'sort.chrono': {
    be: 'ад першага да апошняга',
    en: 'first to last',
  },
  'sort.newest': {
    be: 'ад новых да старых',
    en: 'newest first',
  },
  'outro.orderChrono': {
    be: 'Вы прайшлі ўвесь шлях — ад першай песьні да апошняй. Калі хочаце, каб наступнае наведваньне пачыналася з найноўшых трэкаў, перакуліце парадак. А калі захочаце вярнуць усё як было — проста вярніцеся сюды.',
    en: 'You have walked the whole path — from the first song to the last. If you would like your next visit to begin with the newest tracks, flip the order. And whenever you want it back the way it was — just return here.',
  },
  'outro.orderNewest': {
    be: 'Цяпер гісторыя разгортваецца ад найноўшых трэкаў да самых першых. Калі захочаце зноў пачаць яе з пачатку — перакуліце парадак назад.',
    en: 'The story now unfolds from the newest tracks back to the very first. If you would like to start it from the beginning again — flip the order back.',
  },
  'outro.orderFlip': {
    be: 'Перакуліць парадак',
    en: 'Flip the order',
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
