<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useLexicalComposer } from 'lexical-vue'

const model = defineModel()
const editorModal = defineModel('editor')
const editor = useLexicalComposer()
editorModal.value = editor

onMounted(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
        model.value = editorState
    })

    onUnmounted(() => {
        unregister()
    })
})
</script>
<template />