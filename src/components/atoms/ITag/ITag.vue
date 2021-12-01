<template>
  <div
    :class="[
      'tag',
      {
        'tag--small': small
      }
    ]"
  >
    <span :style="customStyle"> {{ label }} </span>
  </div>
</template>

<script>
export default {
  name: 'ITag',

  props: {
    small: {
      type: Boolean,
      default: true,
    },

    label: {
      type: String,
      required: true,
    },

    customStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
}
</script>

<style scoped lang="scss">
.tag {
  color: #0058a3;
  display: initial;
  padding: 0 0.1rem 0 0;
  // border: 1px solid #f0f0f0;
  box-sizing: border-box;
  // border-radius: 6/100rem;
}

.tag--small {
  span {
    font-weight: 700;
    font-size: 0.12rem;
    line-height: 0.18rem;
  }
}
</style>
