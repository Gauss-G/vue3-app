import ViteI18n from '@intlify/vite-plugin-vue-i18n'
import ViteYaml from '@rollup/plugin-yaml'
import ViteLegacy from '@vitejs/plugin-legacy'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import ViteVisualizer from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import ViteComponents from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const isReport = mode === 'report'
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const plugins = [
    Vue(),

    /**
     * DESC:
     * auto import components
     */
    ViteComponents({
      customComponentResolvers: [
        /**
         * DESC:
         * auto import iconify
         */
        ViteIconsResolver({
          componentPrefix: '',
          enabledCollections: ['cil'],
        }),
      ],
    }),

    ViteIcons(),

    /**
     * DESC:
     * localization
     */
    ViteI18n({
      include: [resolve(__dirname, 'locales/**')],
      runtimeOnly: false,
    }),

    /**
     * DESC:
     * converts YAML files to ES6 modules
     */
    ViteYaml(),
  ]

  const build = {
    base: '/',
    manifest: true,
  }
  if (isProd) {
    build.base = process.env.VITE_BASE_URL
    build.manifest = false

    plugins.push(
      /**
       * DESC:
       * provides support for legacy browsers
       * that do not support native ESM
       */
      ViteLegacy({
        targets: [
          'defaults',
          'not IE 11',
        ],
      }),
    )
  }

  if (isReport) {
    plugins.push(
      /**
       * DESC:
       * visualize bundle
       */
      ViteVisualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true,
      }),
    )
  }

  let optimizeDeps = {}
  if (isDev) {
    /**
     * DESC:
     * dependency pre-bundling
     */
    optimizeDeps = {
      include: [
        'vue',
        'vuex',
        'vue-router',
      ],
    }
  }
  const server = {
    fs: {
      strict: false,
    },
    host: '0.0.0.0',
    open: true,
    // https: true,
    proxy: {
      '/api-host': {
        target: 'https://www.pp01.test.ikea.cn/api-host',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-host/, ''),
        // pathRewrite: {
        //   '^/api_host': ''
        // }
      },
      '/api-csh': {
        target: 'https://csh.ikea.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-csh/, ''),
        // pathRewrite: {
        //   '^/api_host': ''
        // }
      },
      '/api-search': {
        target: 'https://search.ikea.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-search/, ''),
        // pathRewrite: {
        //   '^/api_host': ''
        // }
      },
      '/api-ciam-host': {
        target: 'https://api-mpp.ingka-system.cn/ciam/crbff',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-ciam-host/, ''),
      },
    },
  }
  return {
    ...build,
    plugins,
    optimizeDeps,
    server,
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `
            @import "@/styles/vendors/tailwind.scss";
            @import "@/styles/vendors/nprogress.scss";
            @import "@/styles/index.scss";
          `,
        },
        less: {
          javascriptEnabled: true, // 使用 antd 的 less 样式 需要开启
        },
      },
    },

    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
        {
          find: '@@',
          replacement: resolve(__dirname, './src/modules'),
        },
        {
          find: 'atoms',
          replacement: resolve(__dirname, './src/components/atoms'),
        },
        {
          find: 'molecules',
          replacement: resolve(__dirname, './src/components/molecules'),
        },
        {
          find: 'templates',
          replacement: resolve(__dirname, './src/components/templates'),
        },
        {
          find: 'composables',
          replacement: resolve(__dirname, './src/composables'),
        },
      ],
    },
  }
})
