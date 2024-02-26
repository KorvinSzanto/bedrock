<script setup>
import {nextTick, onMounted, onUnmounted, ref} from 'vue'
import {$findMatchingParent, $getNearestNodeOfType, mergeRegister} from '@lexical/utils'
import {
    $isListNode, INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND, ListNode,
    REMOVE_LIST_COMMAND
} from '@lexical/list'
import {INSERT_TABLE_COMMAND} from '@lexical/table'
import {$getSelectionStyleValueForProperty, $isAtNodeEnd, $isParentElementRTL, $wrapNodes} from '@lexical/selection'
import {$isLinkNode, TOGGLE_LINK_COMMAND, toggleLink} from '@lexical/link'
import Modal from '../../../Help/Modal.vue'

import {$createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP,} from '@lexical/code'
import {$createHeadingNode, $createQuoteNode, $isHeadingNode} from '@lexical/rich-text'
import {
    $createParagraphNode,
    $getSelection,
    $insertNodes,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_NORMAL,
    FORMAT_TEXT_COMMAND,
    KEY_MODIFIER_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextNode,
    UNDO_COMMAND,
} from 'lexical'
import {useLexicalComposer} from "lexical-vue";
import ToolbarButton from "./ToolbarButton.vue";
import Separator from "./ToolbarSeparator.vue";
import ContextMenu from "../../../menu/ContextMenu.vue";
import MenuItem from "../../../menu/MenuItem.vue";
import MenuDivider from "../../../menu/MenuDivider.vue";
import {INSERT_IMAGE_COMMAND} from "../Image/shared";

import IconParagraph from 'bootstrap-icons/icons/paragraph.svg?raw'
import IconBold from 'bootstrap-icons/icons/type-bold.svg?raw'
import IconItalic from 'bootstrap-icons/icons/type-italic.svg?raw'
import IconUnderline from 'bootstrap-icons/icons/type-underline.svg?raw'
import IconStrikethrough from 'bootstrap-icons/icons/type-strikethrough.svg?raw'
import IconHighlight from 'bootstrap-icons/icons/marker-tip.svg?raw'
import IconCode from 'bootstrap-icons/icons/code.svg?raw'
import IconCodeBlock from 'bootstrap-icons/icons/code-square.svg?raw'
import IconSubscript from 'bootstrap-icons/icons/subscript.svg?raw'
import IconSuperscript from 'bootstrap-icons/icons/superscript.svg?raw'
import IconLink from 'bootstrap-icons/icons/link.svg?raw'
import IconImage from 'bootstrap-icons/icons/image.svg?raw'
import IconUndo from 'bootstrap-icons/icons/arrow-counterclockwise.svg?raw'
import IconRedo from 'bootstrap-icons/icons/arrow-clockwise.svg?raw'
import IconH1 from 'bootstrap-icons/icons/type-h1.svg?raw'
import IconH2 from 'bootstrap-icons/icons/type-h2.svg?raw'
import IconH3 from 'bootstrap-icons/icons/type-h3.svg?raw'
import IconH4 from 'bootstrap-icons/icons/type-h4.svg?raw'
import IconH5 from 'bootstrap-icons/icons/type-h5.svg?raw'
import IconH6 from 'bootstrap-icons/icons/type-h6.svg?raw'
import IconSlash from 'bootstrap-icons/icons/slash-lg.svg?raw'
import IconBulletedList from 'bootstrap-icons/icons/list-ul.svg?raw'
import IconNumberedList from 'bootstrap-icons/icons/list-ol.svg?raw'
import IconCheckList from 'bootstrap-icons/icons/list-check.svg?raw'
import IconQuote from 'bootstrap-icons/icons/quote.svg?raw'
import IconTable from 'bootstrap-icons/icons/table.svg?raw'
import IconFileHtml from 'bootstrap-icons/icons/filetype-html.svg?raw'
import PageLinkNode, {toggleConcreteLink} from "../PageLink/PageLinkNode";

function iconSlash(icon) {
    const dom = (new DOMParser()).parseFromString(IconLink, 'text/html').querySelector('svg');
    [...(new DOMParser()).parseFromString(IconSlash, 'text/html').querySelector('svg').children].map(function(child) {
        child.style = 'fill: rgba(0,0,0,0.55)'
        dom.appendChild(child)
    })

    return dom.outerHTML
}

const IconLinkSlash = iconSlash(IconLink)

const concreteRef = ref(null)

const editor = useLexicalComposer()

const fontSize = ref('15px')
const fontColor = ref('#000')
const bgColor = ref('#fff')
const canUndo = ref(false)
const canRedo = ref(false)
const blockType = ref('paragraph')
const selectedElementKey = ref()
const codeLanguage = ref('')
const isRTL = ref(false)
const fontFamily = ref('Arial')
const isLink = ref(false)
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const isStrikethrough = ref(false)
const isHighlight = ref(false)
const isSubscript = ref(false)
const isSuperscript = ref(false)
const isCode = ref(false)

const activeMenu = ref(null)

const menus = {
    node: 'node',
    font: 'font',
    concrete: 'concrete'
}

const blockMenuItems = [
    'paragraph',
    'separator',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'separator',
    'bullet', 'number',
    'separator',
    'quote',
    'code'
]

/**
 * @enum
 */
const blockTypeToBlockName = {
    bullet: ['Bulleted List', IconBulletedList],
    check: ['Check List', IconCheckList],
    code: ['Code Block', IconCodeBlock],
    h1: ['Heading 1', IconH1],
    h2: ['Heading 2', IconH2],
    h3: ['Heading 3', IconH3],
    h4: ['Heading 4', IconH4],
    h5: ['Heading 5', IconH5],
    h6: ['Heading 6', IconH6],
    number: ['Numbered List', IconNumberedList],
    paragraph: ['Normal', IconParagraph],
    quote: ['Quote', IconQuote],
}

const emit = defineEmits(['isLinkEditMode'])

const editAsHtml = defineModel('editAsHtml')

onMounted(() => {
    const unregisterMergeListener = mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar()
            })
        }),
        editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                $updateToolbar()
                return false
            },
            1,
        ),
        editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                canUndo.value = payload
                return false
            },
            1,
        ),
        editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                canRedo.value = payload
                return false
            },
            1,
        ),
    )

    onUnmounted(() => {
        unregisterMergeListener()
    })
})

onMounted(() => {
    const unregister = editor.registerCommand(
        KEY_MODIFIER_COMMAND,
        (payload) => {
            const event = payload
            const { code, ctrlKey, metaKey } = event

            if (code === 'KeyK' && (ctrlKey || metaKey)) {
                event.preventDefault()
                let url = null
                if (!isLink.value) {
                    emit('isLinkEditMode', true)
                    url = sanitizeUrl('https://')
                }
                else {
                    emit('isLinkEditMode', false)
                }
                return editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
            }
            return false
        },
        COMMAND_PRIORITY_NORMAL,
    )

    onUnmounted(() => {
        unregister()
    })
})

onMounted(() => {
    let listener = () => {
        if (activeMenu.value !== null) {
            console.log('global click')
            activeMenu.value = null
        }
    }
    window.addEventListener('click', listener)

    onUnmounted(() => {
        window.removeEventListener('click', listener)
    })
})

function $updateToolbar() {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        let element
            = anchorNode.getKey() === 'root'
                ? anchorNode
                : $findMatchingParent(anchorNode, (e) => {
                    const parent = e.getParent()
                    return parent !== null && $isRootOrShadowRoot(parent)
                })

        if (element === null)
            element = anchorNode.getTopLevelElementOrThrow()

        const elementKey = element.getKey()
        const elementDOM = editor.getElementByKey(elementKey)

        // Update text format
        isBold.value = selection.hasFormat('bold')
        isItalic.value = selection.hasFormat('italic')
        isUnderline.value = selection.hasFormat('underline')
        isStrikethrough.value = selection.hasFormat('strikethrough')
        isHighlight.value = selection.hasFormat('highlight')
        isCode.value = selection.hasFormat('code')
        isSuperscript.value = selection.hasFormat('superscript')
        isSubscript.value = selection.hasFormat('subscript')
        isRTL.value = $isParentElementRTL(selection)

        // Update links
        const node = getSelectedNode(selection)
        const parent = node.getParent()
        isLink.value = !!($isLinkNode(parent) || $isLinkNode(node));

        if (elementDOM !== null) {
            selectedElementKey.value = elementKey
            if ($isListNode(element)) {
                const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                blockType.value = parentList
                    ? parentList.getListType()
                    : element.getListType()
            }
            else {
                const type = $isHeadingNode(element)
                    ? element.getTag()
                    : element.getType()
                if (type in blockTypeToBlockName)
                    blockType.value = type

                if ($isCodeNode(element)) {
                    const language
                        = element.getLanguage()
                    codeLanguage.value = language ? CODE_LANGUAGE_MAP[language] || language : ''
                }
            }
        }

        // Handle buttons
        fontSize.value = $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
        fontColor.value = $getSelectionStyleValueForProperty(selection, 'color', '#000')
        bgColor.value = $getSelectionStyleValueForProperty(selection, 'background-color', '#fff')
        fontFamily.value = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')

        // let matchingParent
        if ($isLinkNode(parent)) {
            // If node is a link, we need to fetch the parent paragraph node to set format
            // matchingParent = $findMatchingParent(
            //   node,
            //   parentNode => $isElementNode(parentNode) && !parentNode.isInline(),
            // )
        }

        // If matchingParent is a valid node, pass it's format type
        // elementFormat.value = $isElementNode(matchingParent)
        //       ? matchingParent.getFormatType()
        //       : $isElementNode(node)
        //       ? node.getFormatType()
        //       : parent?.getFormatType() || 'left'
    }
}


function getSelectedNode(selection) {
    const anchor = selection.anchor
    const focus = selection.focus
    const anchorNode = selection.anchor.getNode()
    const focusNode = selection.focus.getNode()
    if (anchorNode === focusNode)
        return anchorNode

    const isBackward = selection.isBackward()
    if (isBackward)
        return $isAtNodeEnd(focus) ? anchorNode : focusNode

    else
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode
}

const SUPPORTED_URL_PROTOCOLS = new Set([
    'http:',
    'https:',
    'mailto:',
    'sms:',
    'tel:',
])

function sanitizeUrl(url) {
    try {
        const parsedUrl = new URL(url)

        if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol))
            return 'about:blank'
    }
    catch {
        return url
    }
    return url
}

function command(type, payload) {
    editor.dispatchCommand(type, payload)
}

function textCommand(payload) {
    command(FORMAT_TEXT_COMMAND, payload)
    return true
}

function toggleBold() {
    textCommand('bold')
}
function toggleItalic() {
    textCommand('italic')
}
function toggleUnderline() {
    textCommand('underline')
}
function toggleStrikethrough() {
    textCommand('strikethrough')
}
function toggleHighlight() {
    textCommand('highlight')
}
function toggleCode() {
    textCommand('code')
}
function toggleSuperscript() {
    textCommand('superscript')
}
function toggleSubscript() {
    textCommand('subscript')
}

/**
 * @param {blockTypeToBlockName} type
 *     'paragraph',
 *     'separator',
 *     'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
 *     'separator',
 *     'bullet', 'number',
 *     'separator',
 *     'quote',
 *     'code'
 */
function changeNode(type) {
    switch (type) {
    case 'paragraph':
        return formatParagraph()
    case 'bullet':
        return formatBulletList()
    case 'number':
        return formatNumberedList()
    case 'quote':
        return formatQuote()
    case 'code':
        return formatCode()
    default:
        return formatHeading(type)
    }
}


function formatParagraph() {
    if (blockType.value !== 'paragraph') {
        console.log('formatting paragraph')
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection))
                $wrapNodes(selection, () => $createParagraphNode())
        })
    }
}

function formatHeading(headingSize) {
    if (blockType.value !== headingSize) {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () =>
                    $createHeadingNode(headingSize))
            }
        })
    }
}

function formatBulletList() {
    if (blockType.value !== 'bullet')
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    else
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
}

function formatNumberedList() {
    if (blockType.value !== 'number')
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    else
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
}

function formatQuote() {
    if (blockType.value !== 'quote') {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection))
                $wrapNodes(selection, () => $createQuoteNode())
        })
    }
}

function formatCode() {
    if (blockType.value !== 'code') {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {
                if (selection.isCollapsed()) {
                    $wrapNodes(selection, () => $createCodeNode())
                }
                else {
                    const textContent = selection.getTextContent()
                    const codeNode = $createCodeNode()
                    selection.insertNodes([codeNode])
                    selection.insertRawText(textContent)
                }
            }
        })
    }
}

function link() {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://example.com')
}

function unlink() {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
}

function addImage() {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: "https://placehold.co/600x400/EEE/31343C"
    })
}
async function toggleMenu(menu) {
    console.log('Toggling to', menu)
    await nextTick()
    activeMenu.value = activeMenu.value === menu ? null : menu
}

function concretePage() {
    activeMenu.value = null
    editor.update(function() {
        toggleConcreteLink('10', {})
    })
}
function concreteFile() {

}
function concreteBlock() {

}
</script>
<template>
    <div class="ccm-editor-toolbar">
        <ToolbarButton title="Undo" :disabled="!canUndo" :icon-html="IconUndo" @click.prevent="editor.dispatchCommand(UNDO_COMMAND)" />
        <ToolbarButton title="Redo" :disabled="!canRedo" :icon-html="IconRedo" @click.prevent="editor.dispatchCommand(REDO_COMMAND)" />
        <Separator />
        <ToolbarButton title="Format" style="aspect-ratio: auto" :active="activeMenu === menus.node" @click.self.stop.prevent="toggleMenu(menus.node)" ref="concreteRef">
            <span v-if="blockTypeToBlockName[blockType][1]" class="pe-none" v-html="blockTypeToBlockName[blockType][1]"></span>
        </ToolbarButton>
        <div style="width: 0">
            <ContextMenu :show="activeMenu === menus.node">
                <template v-for="type of blockMenuItems">
                    <MenuDivider v-if="type === 'separator'" />
                    <MenuItem v-else @click.stop.prevent="() => changeNode(type)" :icon-html="blockTypeToBlockName[type][1]">
                        {{ blockTypeToBlockName[type][0] }}
                    </MenuItem>
                </template>
            </ContextMenu></div>
        <Separator />
        <ToolbarButton title="Bold" :active="isBold" :icon-html="IconBold" @click.prevent="toggleBold" />
        <ToolbarButton title="Italic" :active="isItalic" :icon-html="IconItalic" @click.prevent="toggleItalic" />
        <ToolbarButton title="Underline" :active="isUnderline" :icon-html="IconUnderline" @click.prevent="toggleUnderline" />
        <ToolbarButton title="Strikethrough" :active="isStrikethrough" :icon-html="IconStrikethrough" @click.prevent="toggleStrikethrough" />
        <Separator />
        <ToolbarButton title="Highlight" :active="isHighlight" :icon-html="IconHighlight" @click.prevent="toggleHighlight" />
        <ToolbarButton title="Code" :active="isCode" :icon-html="IconCode" @click.prevent="toggleCode" />
        <ToolbarButton title="Subscript" :active="isSubscript" :icon-html="IconSubscript" @click.prevent="toggleSubscript" />
        <ToolbarButton title="Superscript" :active="isSuperscript" :icon-html="IconSuperscript" @click.prevent="toggleSuperscript" />
        <Separator />
        <ToolbarButton title="Link" :active="isLink" :icon-html="IconLink" @click.prevent="link" />
        <ToolbarButton :disabled="!isLink" :icon-html="IconLinkSlash" @click.prevent="unlink"  />
        <ToolbarButton title="Image" :active="isImage" :icon-html="IconImage" @click.prevent="addImage" />
        <Separator />
        <ToolbarButton title="Concrete" :active="activeMenu === menus.concrete" @click.self.stop.prevent="toggleMenu(menus.concrete)" ref="concreteRef">
            <i style="width:1.5rem" class="fas fa-hand-sparkles pe-none"></i>
        </ToolbarButton>
        <div style="width: 0px">
            <ContextMenu :show="activeMenu === menus.concrete">
                <MenuItem icon="pager" @click.stop.prevent="concretePage">Link Page</MenuItem>
                <MenuItem icon="file" @click.stop.prevent="concreteFile">Link Image</MenuItem>
                <MenuDivider />
                <MenuItem icon="square" @click.stop.prevent="concreteBlock">Add Block</MenuItem>
            </ContextMenu>
        </div>
        <Separator />
        <toolbar-button :icon-html="IconTable" @click="command(INSERT_TABLE_COMMAND, {columns:'3', rows: '2'})" />
        <toolbar-button :active="editAsHtml" title="Edit as HTML" :icon-html="IconFileHtml" @click="editAsHtml = !editAsHtml" />
    </div>
    <Modal />
</template>
<style scoped lang="scss">
    .ccm-editor-toolbar {
        z-index: 10;
        background:white;
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;

        > * {
            text-align: center;
            height: 1.5rem;
            aspect-ratio: 1 / 1;
        }
    }
</style>