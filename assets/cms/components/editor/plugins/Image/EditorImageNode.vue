<script setup>
import {ref} from "vue";
import {LexicalBlockWithAlignableContents} from "lexical-vue";

const props = defineProps({
    src: String,
    alt: String,
    width: String,
    height: String,
})
</script>

<template>
    <img v-bind="props" style="pointer-events: none; display: inline-block" />
</template>