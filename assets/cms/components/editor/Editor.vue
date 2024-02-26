<script setup>
import {$createParagraphNode, $getEditor, $getRoot, $getSelection} from 'lexical'
import {
    LexicalComposer,
    LexicalContentEditable,
    LexicalHistoryPlugin,
    LexicalLinkPlugin,
    LexicalListPlugin,
    LexicalRichTextPlugin,
    LexicalTablePlugin,
    LexicalTabIndentationPlugin,
    LexicalMarkdownShortcutPlugin,
    LexicalHashtagPlugin,
    LexicalAutoFocusPlugin,
} from 'lexical-vue'
import Toolbar from "./plugins/Toolbar"
import Theme from "./theme/Theme.js"
import EventListener from "./EventListener.vue";
import {$generateHtmlFromNodes} from "@lexical/html";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import ImageNode from "./plugins/Image/ImageNode"
import {ListItemNode, ListNode} from "@lexical/list";
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { $generateNodesFromDOM } from '@lexical/html'
import Image from "./plugins/Image/Image.vue";
import {onMounted, ref, watch} from "vue";
import PageLinkNode from "./plugins/PageLink/PageLinkNode";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditor/FloatingLinkEditorPlugin.vue";
const props = defineProps({
    html: String,
    nodes: {
        type: Array,
        default: () => [],
    }
})

const value = defineModel()
const editor = defineModel('editor')

const editAsHtml = ref(false)
const editHeight = ref(0)
/**
 * @type {Ref<UnwrapRef<?LexicalEditor>>}
 */
const editorElement = ref(null)
const htmlToEdit = ref('')
const error = ref(null)

onMounted(function () {
    console.log(props.html)
    if (props.html) {
        editor.value.update(() => {
            useHtml(props.html)
        })
    }
})

function useHtml(html) {
    const dom = (new DOMParser()).parseFromString(html, 'text/html')

    editor.value.update(function() {
        const editor = $getEditor()
        const newNodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        root.append(...newNodes)
    })
}

watch(editAsHtml, async function (to, from) {
    if (to && editorElement.value) {
        editHeight.value = editorElement.value.$el.offsetHeight
        htmlToEdit.value = await renderHtml()
        return
    }

    try {
        useHtml(htmlToEdit.value.replaceAll(/>\s+</g, '><'))
    } catch (e) {
        error.value = e
        editAsHtml.value = true
    }
})

async function renderHtml() {
    return new Promise(function (resolve) {
        editor.value.update(function () {
            resolve(printPrettyHTML($generateHtmlFromNodes(editor.value)))
        })
    });
}

function printPrettyHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str.trim();
    return prettifyHTML(div, 0).innerHTML.trim();
}

function prettifyHTML(node, level) {
    const indentBefore = Array.from({ length: level++ + 1 }).join("    ");
    const indentAfter = Array.from({ length: level - 1 }).join("    ");
    let textNode;
    for (let i = 0; i < node.children.length; i++) {
        textNode = document.createTextNode(`
${indentBefore}`);
        node.insertBefore(textNode, node.children[i]);
        prettifyHTML(node.children[i], level);
        if (node.lastElementChild === node.children[i]) {
            textNode = document.createTextNode(`
${indentAfter}`);
            node.appendChild(textNode);
        }
    }
    return node;
}

defineExpose({
    renderHtml
})

/**
 * @type {CreateEditorArgs}
 */
const config = {
    namespace: 'MyEditor',
    theme: Theme,
    onError(error) {
        // Catch any errors that occur during Lexical updates and log them
        // or throw them as needed. If you don't throw them, Lexical will
        // try to recover gracefully without losing user data.
        console.error(error)
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        TableCellNode,
        TableNode,
        TableRowNode,
        CodeHighlightNode,
        CodeNode,
        HashtagNode,
        LinkNode,
        AutoLinkNode,
        ListNode,
        ListItemNode,
        ImageNode,
        PageLinkNode,
        ...props.nodes
    ]
}

const urlRegExp = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
)
function validateUrl(url) {
    return url === 'https://' || urlRegExp.test(url);
}
</script>

<template>
    <LexicalComposer :initial-config="config" ref="composer">
        <div class="ccm-editor-root">
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <Toolbar v-model:edit-as-html="editAsHtml" />
            <LexicalRichTextPlugin>
                <template #contentEditable>
                    <LexicalContentEditable v-show="!editAsHtml" v-model="value" class="ccm-editor-contenteditable" ref="editorElement" />
                    <textarea v-if="editAsHtml" class="ccm-editor-contenteditable" style="width: 100%" :style="`min-height: ${editHeight}px`" v-model="htmlToEdit"></textarea>
                </template>
                <template #placeholder>
                    <div>
                        Enter some text...
                    </div>
                </template>
            </LexicalRichTextPlugin>
            <LexicalHistoryPlugin />
            <LexicalLinkPlugin />
            <LexicalListPlugin />
            <LexicalHistoryPlugin />
            <LexicalAutoFocusPlugin />
            <LexicalListPlugin />
            <LexicalLinkPlugin :validate-url="validateUrl" />
            <LexicalHashtagPlugin />
            <LexicalTablePlugin />
            <LexicalTabIndentationPlugin />
            <LexicalMarkdownShortcutPlugin />
            <FloatingLinkEditorPlugin />
            <Image />
            <EventListener v-model="value" v-model:editor="editor" />
            <slot/>
        </div>
    </LexicalComposer>
</template>
<style>
.font-bold {
    font-weight: bold;
}

.font-italic {
    font-style: italic;
}

.ccm-editor-root {
    padding: 0.25rem;
}

.ccm-editor-contenteditable {
    border: 0;
    font-size: 15px;
    display: block;
    position: relative;
    outline: 0;
    min-height: 150px;
    border-bottom: solid 1px rgba(0, 0, 0, 0.25)
}

.text-decoration-underline-line-through {
    text-decoration: underline line-through;
}

.ccm-editor-nested-list {
    list-style-type: none
}

blockquote {
    border-left: solid 2px var(--bs-dark);
    padding-left: 1rem
}

th, td {
    outline: solid 1px #ccc;
}
</style>