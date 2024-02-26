<template>
    <a href="#"
       class="ccm-editor-toolbar-btn"
       :class="{active, disabled}"
       role="button"
       v-if="iconHtml"
       v-html="iconHtml"
       @click.prevent
    />
    <a href="#"
       class="ccm-editor-toolbar-btn"
       :class="{active, disabled}"
       role="button"
       v-else
       @click.prevent
    >
        <slot>
            <i :class="[iconType, icon]"></i>
        </slot>
    </a>
</template>
<script setup>
const props = defineProps({
    active: Boolean,
    disabled: Boolean,
    iconType: String,
    icon: String,
    iconHtml: String,
})
const iconType = props.iconType ? props.iconType : 'fas'
</script>
<style scoped>
    .ccm-editor-toolbar-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #777;
        border: solid 1px transparent;
        text-decoration: none !important;
        transition: all 100ms linear;

        &:hover {
            color: rgb(158, 15, 179);
            border-bottom: solid 1px rgb(158, 15, 179);
        }
        &.active {
            background-color: rgba(158, 15, 179, 0.25);
            color: rgb(84, 9, 95);
        }
        &.disabled {
            pointer-events: none;
            color: #ccc;

            &:hover {
                background-color: inherit;
                cursor: default;
                border-color: transparent;
            }
        }
    }
</style>
