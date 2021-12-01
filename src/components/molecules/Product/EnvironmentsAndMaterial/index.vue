<template>
  <div v-if="data && data.length > 0" class="environments-material">
    <div v-for="(item, idx) in data" :key="idx + item.typeText" class="environments-material__item">
      <h4 v-if="item.typeText" class="environments-material__item--title">
        {{ item.typeText }}
      </h4>
      <div v-if="item.partMaterialList && item.partMaterialList.length > 0" class="environments-material__item--content">
        <div v-for="(subItem, subIdx) in item.partMaterialList" :key="subIdx + subItem.first" class="subItem">
          <label v-if="subItem.first" class="label">{{ subItem.first }}</label>
          <span class="text">
            {{ subItem.second }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <span>-</span>
  </div>
</template>

<script>
export default {
  name: 'EnvironmentsAndMaterial',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped lang="scss">
.environments-material {
  position: relative;
  display: block;
}

.environments-material__item {
  position: relative;
  display: block;
  margin: 0 0 0.3rem;

  .environments-material__item--title {
    margin: 0 0 0.06rem;
    font-weight: $font-weight-bold;
    font-size: 0.16rem;
    line-height: 0.24rem;
  }

  .environments-material__item--content {
    &:deep(.subItem) {
      position: relative;
      display: block;
      margin: 0 0 0.06rem;
    }

    &:deep(.label) {
      display: inline-block;
      margin: 0 0.06rem 0 0;
      font-weight: $font-weight-bold;
    }
  }
}
</style>
