<script setup>
import { useLexicalComposer } from 'lexical-vue'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR } from 'lexical'

import { onMounted, onUnmounted } from 'vue'
import { INSERT_IMAGE_COMMAND } from './shared'
import ImageNode, { $createImageNode } from './ImageNode.js'

const editor = useLexicalComposer()

onMounted(() => {
    if (!editor.hasNodes([ImageNode]))
        throw new Error('ImagePlugin: ImageNode not registered on editor')

    const unregister = editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
            $insertNodeToNearestRoot($createImageNode(payload))
            return true
        },
        COMMAND_PRIORITY_EDITOR,
    )

    onUnmounted(() => {
        unregister()
    })
})
</script>
<template>
<!--    <FloatingImageToolbar priority="0" />-->
</template>