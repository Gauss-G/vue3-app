# ikeacn-comparison-client-
ikeacn products comparison page

<div align="center">
  <h2>IKEACN Comparison Client</h2>

  <a href="https://standardjs.com">
    <img 
      src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat" 
      alt="Code Style"
    >
  </a>

  <a href="http://commitizen.github.io/cz-cli">
    <img 
      src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat" 
      alt="Commitizen"
    >
  </a>
</div>
<br />

## Framework
- Foundation: [vite](https://github.com/vitejs/vite), [vue-next](https://github.com/vuejs/vue-next), [esbuild](https://github.com/evanw/esbuild)
- Vue 3 ecosystem: [vue](https://github.com/vuejs/vue-next), [vuex](https://next.vuex.vuejs.org), [vue-router](https://github.com/vuejs/vue-router-next)
- Typescript: [Typescript](https://www.typescriptlang.org/)
- Support legacy browsers: [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)
- Vue Hooks: [vueuse](https://github.com/vueuse/vueuse)
- Fonts auto injecting: [vite-plugin-fonts](https://github.com/stafyniaksacha/vite-plugin-fonts)
- Just in time css utilities: [tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- Icons: [@turboui/icons](https://git.build.ingka.ikea.com/cn-admin-portal/turbo-ui)
- Form validation: [vuelidate](https://github.com/vuelidate/vuelidate)
- Localization: [vue-i18n](https://github.com/intlify/vue-i18n-next), [vite-plugins-i18n](https://github.com/intlify/vite-plugin-vue-i18n)
- UI Documentation: [storybook](https://github.com/storybookjs/storybook) 
- Testing: [jest](https://github.com/facebook/jest), [testing-library](https://testing-library.com/docs/vue-testing-library/intro)
- HTTP request: [axios](https://github.com/axios/axios)
- Git custom hooks: [husky](https://github.com/typicode/husky)
- Commit conventions and Linter: [commitizen](https://github.com/commitizen/cz-cli), [commitlint](https://github.com/conventional-changelog/commitlint)
- Code Linter: [eslint](https://github.com/eslint/eslint), [stylelint](https://github.com/stylelint/stylelint)
- Style Linter: [stylelint](https://github.com/stylelint/stylelint)
- Visualize bundle: [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- Optimized nginx config: [nginx](https://nginx.org/en/docs/)
- Dockerize: [Docker](https://docs.docker.com/get-started/overview/)

## Dev Tools
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar): Vue 3 IDE support
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally): All in one i18n support
- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): IDE support for Tailwind CSS
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Requirement
  - [node.js](http://nodejs.org/)
  - [volta](https://docs.volta.sh/guide/getting-started)

## Getting Started

### Development

```bash
# clone repository
$ git clone git@git.build.ingka.ikea.com:new-ikea-cn/ikeacn-comparison-client.git

# open folder ikeacn-comparison-client
$ cd ikeacn-comparison-client

# install packages
$ npm install

# build and serve with vite dev server
$ npm run dev

# lint and fix
$ npm run lint:fix
```

### Run with Docker

```bash
# build docker image and tag it with name nginx
$ docker build . -t nginx

# run docker image nginx with name ikeacn-checkout-client in port 9001
$ docker run -it -p 9001:80 --rm --name ikeacn-comparison-client nginx
