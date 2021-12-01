import camelCase from 'camelcase'
import { createI18n } from 'vue-i18n'
import { LANGUAGES } from '@/constants'

const messages = {}
const globalLocales = Object.fromEntries(
  Object.entries(import.meta.globEager('./*.yaml'))
    .map(([key, value]) => {
      return [key.slice(9, -5), value.default]
    }),
)

const domainLocaleFiles = import.meta.globEager('../modules/**/locale.ts')

const domainLocales = Object.entries(domainLocaleFiles)
  .reduce((prev, [key, value]) => {
    prev[key] = value
    return prev
  }, {})

LANGUAGES.forEach((language) => {
  messages[language] = {
    ...globalLocales[language],
  }

  Object.entries(domainLocales)
    .forEach(([key, value]) => {
      const regLanguage = new RegExp(`${camelCase(language, { pascalCase: true })}$`, 'g')
      const module = key.replace(camelCase(language, { pascalCase: true }), '')

      if (regLanguage.test(key))
        messages[language][module] = value
    })
})
const urlLang = window.location.pathname.split('/')[2] || ''
const lang = ['zh', 'en'].includes(urlLang) ? urlLang : 'zh'
const locales = createI18n({
  legacy: false,
  locale: lang,
  messages,
})

export default locales
