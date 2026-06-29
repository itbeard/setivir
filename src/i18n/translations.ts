import type { Localized } from '../types'

export const ui = {
  'site.tagline': {
    be: 'Беларуская музыка праз штучны інтэлект',
    en: 'Belarusian music through artificial intelligence',
  },
  'hero.intro': {
    be: 'Setivir — экспэрымэнтальны музычны праект, у якім песьні ствараюцца з дапамогай штучнага інтэлекту. Галоўная мэта — прасоўваньне беларускай культуры і беларускамоўнай музыкі. Тэкстамі служаць вершы знакамітых беларускіх пісьменьнікаў, фальклорныя творы і ўласныя аўтарскія тэксты.',
    en: 'Setivir is an experimental music project where songs are created with the help of artificial intelligence. Its main goal is to promote Belarusian culture and Belarusian-language music. The lyrics are drawn from poems by renowned Belarusian writers, folk works, and original texts.',
  },
  'hero.listen': {
    be: 'Слухайце па чарзе, чытайце гісторыі — і знаёмцеся з праектам.',
    en: 'Listen track by track, read the stories — and get to know the project.',
  },
  'hero.scroll': {
    be: 'Пракруціце ўніз',
    en: 'Scroll down',
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
    be: 'Дата',
    en: 'Date',
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
