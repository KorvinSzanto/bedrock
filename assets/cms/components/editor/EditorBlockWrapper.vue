<script setup>
import {
    $getNearestBlockElementAncestorOrThrow,
    mergeRegister,
} from '@lexical/utils'
import {
    $getNodeByKey,
    $getSelection,
    $isDecoratorNode,
    $isNodeSelection,
    $isRangeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
} from 'lexical'
import {ref, watch} from 'vue'
import {$isDecoratorBlockNode, useLexicalComposer, useLexicalNodeSelection, useMounted} from "lexical-vue";

const props = defineProps({
    format: String,
    nodeKey: String,
    baseClass: String,
    focusClass: String,
    /**
     * @type {Ref<UnwrapRef<'block'|'inline-block'|'inline'>>}
     */
    type: String,
})

const emits = defineEmits(['change'])

const type = props.type || 'block'

const editor = useLexicalComposer()
const { isSelected, setSelected, clearSelection } = useLexicalNodeSelection(props.nodeKey)
const containerRef = ref(null)

watch(isSelected, v => emits('change', v))

function onDelete(event) {
    if (isSelected.value && $isNodeSelection($getSelection())) {
        event.preventDefault()
        const node = $getNodeByKey(props.nodeKey)
        if ($isDecoratorNode(node))
            node?.remove()
    }
    return false
}

useMounted(() => {
    return mergeRegister(
        editor.registerCommand(
            FORMAT_ELEMENT_COMMAND,
            (formatType) => {
                if (isSelected.value) {
                    const selection = $getSelection()

                    if ($isNodeSelection(selection)) {
                        const node = $getNodeByKey(props.nodeKey)

                        if (node && $isDecoratorBlockNode(node))
                            node.setFormat(formatType)
                    }
                    else if ($isRangeSelection(selection)) {
                        const nodes = selection.getNodes()

                        for (const node of nodes) {
                            if ($isDecoratorBlockNode(node)) {
                                node.setFormat(formatType)
                            }
                            else {
                                const element = $getNearestBlockElementAncestorOrThrow(node)
                                element.setFormat(formatType)
                            }
                        }
                    }

                    return true
                }
                return false
            },
            COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
            CLICK_COMMAND,
            (event) => {
                if (event.target === containerRef.value) {
                    event.preventDefault()
                    if (!event.shiftKey)
                        clearSelection()

                    setSelected(!isSelected.value)
                    return true
                }
                return false
            },
            COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
            KEY_DELETE_COMMAND,
            onDelete,
            COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
            KEY_BACKSPACE_COMMAND,
            onDelete,
            COMMAND_PRIORITY_LOW,
        ),
    )
})
</script>

<template>
    <div
        v-if="type === 'block'"
        ref="containerRef"
        :style="`text-align: ${format}`"
        :class="[baseClass, isSelected ? focusClass : '']"
    >
        <slot />
    </div>
    <div
        v-else-if="type === 'inline-block'"
        ref="containerRef"
        :style="`float: ${format}; display: inline-block`"
        :class="[baseClass, isSelected ? focusClass : '']"
    >
        <slot />
    </div>
    <div
        v-else
        ref="containerRef"
        :style="`float: ${format}; display: inline`"
        :class="[baseClass, isSelected ? focusClass : '']"
    >
        <slot />
    </div>
</template>
<style scoped>
div {
    z-index: 1;
}
</style>