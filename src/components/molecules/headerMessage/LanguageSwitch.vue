<template>
  <div class="language-switch">
    <div>
      <span @click="handleSetLanguage('zh')">{{ t('links.chinese') }}</span> |
      <span @click="handleSetLanguage('en')">{{ t('links.english') }}</span>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import langHooks from '@/utils/hooks/lang'
const { t } = useI18n()
const { handleSetLanguage } = langHooks()
</script>
<style lang="scss" scoped>
.language-switch {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.12rem;

  &:hover {
    cursor: pointer;
  }
}
</style>
