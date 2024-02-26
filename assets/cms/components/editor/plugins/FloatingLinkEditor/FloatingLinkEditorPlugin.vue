<script setup>
import {
    $createLinkNode,
    $isAutoLinkNode,
    $isLinkNode,
    TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import {$isPageLinkNode} from "../PageLink/PageLinkNode";
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import {
    $getSelection,
    $isLineBreakNode,
    $isRangeSelection,
    BaseSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    KEY_ESCAPE_COMMAND,
    LexicalEditor,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import {getSelectedNode} from '../../utils/getSelectedNode';
// import {setFloatingElemPositionForLinkEditor} from '../../utils/setFloatingElemPositionForLinkEditor';
// import {sanitizeUrl} from '../../utils/url';
import {onMounted, ref} from "vue";
import {useLexicalComposer} from "lexical-vue";

const {anchorElem} = defineProps({
    anchorElem: {
        type: HTMLElement,
        default: () => document.body
    }
})

const editorRef = ref(null)
const isLink = ref(false)
const isLinkEditMode = ref(false)
const lastSelection = ref(null)
const linkUrl = ref('')
const editingLinkUrl = ref('')
const activeEditor = ref(null)

const editor = useLexicalComposer()

onMounted(function () {
    return mergeRegister(
        editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateLinkEditor();
            });
        }),

        editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateLinkEditor();
                return true;
            },
            COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
            KEY_ESCAPE_COMMAND,
            () => {
                if (isLink) {
                    isLink.value = false;
                    return true;
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH,
        ),
    );
})

onMounted(function() {
    mergeRegister(
        editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                updateToolbar();
            });
        }),
        editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                updateToolbar();
                activeEditor.value = newEditor;
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        ),
        editor.registerCommand(
            CLICK_COMMAND,
            (payload) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const node = getSelectedNode(selection);
                    const linkNode = $findMatchingParent(node, $isLinkNode);
                    if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
                        window.open(linkNode.getURL(), '_blank');
                        return true;
                    }
                }
                return false;
            },
            COMMAND_PRIORITY_LOW,
        ),
    );
})

const nodeTypes = [
    $isLinkNode,
    $isPageLinkNode,
    $isAutoLinkNode,
]

function setFloatingElemPositionForLinkEditor(
    targetRect,
    floatingElem,
    anchorElem,
    verticalGap = 10,
    horizontalOffset = 5,
) {
    const scrollerElem = anchorElem.parentElement;

    if (targetRect === null || !scrollerElem) {
        floatingElem.style.opacity = '0';
        floatingElem.style.transform = 'translate(-10000px, -10000px)';
        return;
    }

    const floatingElemRect = floatingElem.getBoundingClientRect();
    const anchorElementRect = anchorElem.getBoundingClientRect();
    const editorScrollerRect = scrollerElem.getBoundingClientRect();

    let top = targetRect.top - verticalGap;
    let left = targetRect.left - horizontalOffset;

    if (top < editorScrollerRect.top) {
        top += floatingElemRect.height + targetRect.height + verticalGap * 2;
    }

    if (left + floatingElemRect.width > editorScrollerRect.right) {
        left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
    }

    top -= anchorElementRect.top;
    left -= anchorElementRect.left;

    floatingElem.style.opacity = '1';
    floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

function updateLinkEditor() {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const linkParent = $findMatchingParent(node, $isLinkNode);

        if (linkParent) {
            lastSelection.value = linkParent
            linkUrl.value = linkParent.getURL();
        } else if ($isLinkNode(node)) {
            lastSelection.value = node
            linkUrl.value = node.getURL();
        } else {
            linkUrl.value = '';
        }
        if (isLinkEditMode) {
            editingLinkUrl.value = linkUrl.value;
        }
    }
    const editorElem = editorRef.value;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
        return;
    }

    const rootElement = editor.getRootElement();

    if (
        selection !== null &&
        nativeSelection !== null &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode) &&
        editor.isEditable()
    ) {
        const domRect = nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
        if (domRect) {
            domRect.y += 40;
            setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
        }
        lastSelection.value = selection;
    } else if (!activeElement || activeElement.className !== 'link-input') {
        if (rootElement !== null) {
            setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
        }
        lastSelection.value = null
        isLinkEditMode.value = false ;
        linkUrl.value = '';
    }

    return true;
}

function updateToolbar() {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode)
        const focusPageLinkNode = $findMatchingParent(focusNode, $isPageLinkNode)

        if (!(focusLinkNode || focusAutoLinkNode || focusPageLinkNode)) {
            isLink.value = false
            return;
        }

        const badNode = selection.getNodes().find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode)
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)
            const pageLinkNode = $findMatchingParent(node, $isPageLinkNode)

            if (
                !linkNode?.is(focusLinkNode) &&
                !autoLinkNode?.is(focusAutoLinkNode) &&
                !pageLinkNode?.is(focusPageLinkNode) &&
                !linkNode &&
                !autoLinkNode &&
                !pageLinkNode &&
                !$isLineBreakNode(node)
            ) {
                return node;
            }
        });

        isLink.value = true
        lastSelection.value = focusLinkNode || focusAutoLinkNode || focusPageLinkNode
    }
}
</script>
<template>
<div ref="editorRef" class="editor" v-show="isLink">
    <div class="popover show d-block fade" role="tooltip" id="popover554650" x-placement="right">
        <div class="popover-body" v-if="$isPageLinkNode(lastSelection)">
            Page ID
            <input class="form-control form-control-sm" :value="lastSelection.getId()" type="number" />
        </div>
        <div class="popover-body" v-else-if="$isLinkNode(lastSelection)">
            <input class="form-control form-control-sm" :value="linkUrl" />
        </div>
    </div>
</div>
</template>
<style scoped>
.editor {
    z-index: 11;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 100ms ease-in-out;
}
</style>