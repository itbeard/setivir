import type { Localized } from '../types'

export const ui = {
  'site.tagline': {
    be: 'Музыка Тутэйшых',
    en: 'Songs of the Tuteyshya',
  },
  'hero.intro': {
    be: `Вітаю вас, я Аляксей Картыннік, і Setivir — гэта мой эксперыментальны музычны праект, які я ствараю ў суаўтарстве са штучным інтэлектам.

У аснове праекта — сучаснае пераасэнсаваньне беларускай паэтычнай і музычнай спадчыны: твораў знакамітых беларускіх аўтараў, фальклорных песень, а таксама маіх уласных тэкстаў. Для мяне кожная кампазіцыя — гэта спроба дыялогу паміж традыцыяй і новымі тэхналогіямі, паміж жывой культурнай памяццю і мовай сучаснага гуку.

Праз Setivir я імкнуся адкрываць беларускую культуру ў новым кантэксце, пашыраць прысутнасьць беларускамоўнай музыкі ў сучаснай прасторы і паказваць, што спадчына можа ня толькі захоўвацца, але і набываць новыя формы жыцця.`,
    en: `Welcome, I am Aliaksei Kartynnik, and Setivir is my experimental music project, created in co-authorship with artificial intelligence.

At its core, the project is a contemporary reimagining of Belarusian poetic and musical heritage: works by famous Belarusian authors, folk songs, and my own original texts. For me, each composition is an attempt to create a dialogue between tradition and new technologies, between living cultural memory and the language of contemporary sound.

Through Setivir, I seek to reveal Belarusian culture in a new context, expand the presence of Belarusian-language music in the contemporary cultural space, and show that heritage can not only be preserved, but also take on new forms of life.`,
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
  'outro.text': {
    be: 'Праект жывы і працягвае расьці. Сачыце за новымі песьнямі і гісторыямі.',
    en: 'The project is alive and keeps growing. Follow along for new songs and stories.',
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
} satisfies Record<string, Localized>

export type UiKey = keyof typeof ui
