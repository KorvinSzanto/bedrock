<template>
<div v-if='!href' href='#' v-bind='{...attrs, ...props}' :class='{"dropdown-item": true, "d-flex": true, disabled: disabled === true}'>
    <span class="menu-icon flex d-flex" v-if="iconHtml" v-html="iconHtml"></span>
    <span class='menu-icon flex d-flex' v-else-if='icon'>
        <Icon :type='iconType' :icon='icon' />
    </span>
    <span class='flex'><slot></slot></span>
</div>
<a v-else :href='href' v-bind='{...attrs, ...props}' :class='{"dropdown-item": true, "d-flex": true, disabled: disabled}'>
    <span class="menu-icon flex d-flex" v-if="iconHtml" v-html="iconHtml"></span>
    <span class='menu-icon flex d-flex' v-else-if='icon'>
        <Icon :type='iconType' :icon='icon' />
    </span>
    <span class='flex'><slot></slot></span>
</a>
</template>
<style lang='scss' scoped>

.dropdown-item {
  .menu-icon {
    align-items: center;
    justify-content: center;
    width: 2.188em;
  }

  &.disabled {
    .menu-icon {
      color: inherit;
    }
  }

  &:active {
    .menu-icon {
      color: inherit;
    }
  }
}
</style>
<script setup>
import Icon from '../Icon.vue'

const props = defineProps({
    disabled: Boolean,
    icon: String,
    iconType: String,
    href: String,
    iconHtml: String,
})
</script>
