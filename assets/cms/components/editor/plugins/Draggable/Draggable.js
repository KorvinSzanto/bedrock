/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./index.css"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
    $getNearestNodeFromDOMNode,
    $getNodeByKey,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    DRAGOVER_COMMAND,
    DROP_COMMAND
} from "lexical"
import { getElementByKeyOrThrow } from "lexical/src/LexicalUtils"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { isHTMLElement } from "../../utils/guard"
import { Point } from "../../utils/point"
import { Rect } from "../../utils/rect"

const SPACE = 4
const TARGET_LINE_HALF_HEIGHT = 2
const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu"
const DRAG_DATA_FORMAT = "application/x-lexical-drag-block"
const TEXT_BOX_HORIZONTAL_PADDING = 28

const Downward = 1
const Upward = -1
const Indeterminate = 0

let prevIndex = Infinity

function getCurrentIndex(keysLength) {
    if (keysLength === 0) {
        return Infinity
    }
    if (prevIndex >= 0 && prevIndex < keysLength) {
        return prevIndex
    }

    return Math.floor(keysLength / 2)
}

function getTopLevelNodeKeys(editor) {
    const root = editor.getEditorState()._nodeMap.get("root")
    return root ? root.__children : []
}

function getBlockElement(anchorElem, editor, event) {
    const anchorElementRect = anchorElem.getBoundingClientRect()
    const topLevelNodeKeys = getTopLevelNodeKeys(editor)

    let blockElem = null

    editor.getEditorState().read(() => {
        let index = getCurrentIndex(topLevelNodeKeys.length)
        let direction = Indeterminate

        while (index >= 0 && index < topLevelNodeKeys.length) {
            const key = topLevelNodeKeys[index]
            const elem = getElementByKeyOrThrow(editor, key)
            const point = new Point(event.x, event.y)
            const domRect = Rect.fromDOM(elem)
            const { marginTop, marginBottom } = window.getComputedStyle(elem)

            const rect = domRect.generateNewRect({
                bottom: domRect.bottom + parseFloat(marginBottom),
                left: anchorElementRect.left,
                right: anchorElementRect.right,
                top: domRect.top - parseFloat(marginTop)
            })

            const {
                result,
                reason: { isOnTopSide, isOnBottomSide }
            } = rect.contains(point)

            if (result) {
                blockElem = elem
                prevIndex = index
                break
            }

            if (direction === Indeterminate) {
                if (isOnTopSide) {
                    direction = Upward
                } else if (isOnBottomSide) {
                    direction = Downward
                } else {
                    // stop search block element
                    direction = Infinity
                }
            }

            index += direction
        }
    })

    return blockElem
}

function isOnMenu(element) {
    return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`)
}

function setMenuPosition(targetElem, floatingElem, anchorElem) {
    if (!targetElem) {
        floatingElem.style.opacity = "0"
        floatingElem.style.top = "-10000px"
        floatingElem.style.left = "-10000px"
        return
    }

    const targetRect = targetElem.getBoundingClientRect()
    const targetStyle = window.getComputedStyle(targetElem)
    const floatingElemRect = floatingElem.getBoundingClientRect()
    const anchorElementRect = anchorElem.getBoundingClientRect()

    const top =
        targetRect.top +
        (parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 -
        anchorElementRect.top

    const left = SPACE

    floatingElem.style.opacity = "1"
    floatingElem.style.top = `${top}px`
    floatingElem.style.left = `${left}px`
}

function setDragImage(dataTransfer, draggableBlockElem) {
    const { transform } = draggableBlockElem.style

    // Remove dragImage borders
    draggableBlockElem.style.transform = "translateZ(0)"
    dataTransfer.setDragImage(draggableBlockElem, 0, 0)

    setTimeout(() => {
        draggableBlockElem.style.transform = transform
    })
}

function setTargetLine(targetLineElem, targetBlockElem, mouseY, anchorElem) {
    const targetStyle = window.getComputedStyle(targetBlockElem)
    const { top, height } = targetBlockElem.getBoundingClientRect()
    const {
        top: anchorTop,
        width: anchorWidth
    } = anchorElem.getBoundingClientRect()

    let lineTop = top
    // At the bottom of the target
    if (mouseY - top > height / 2) {
        lineTop += height + parseFloat(targetStyle.marginBottom)
    } else {
        lineTop -= parseFloat(targetStyle.marginTop)
    }

    targetLineElem.style.top = `${lineTop -
    anchorTop -
    TARGET_LINE_HALF_HEIGHT}px`
    targetLineElem.style.left = `${TEXT_BOX_HORIZONTAL_PADDING - SPACE}px`
    targetLineElem.style.width = `${anchorWidth -
    (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2}px`
    targetLineElem.style.opacity = ".4"
}

function hideTargetLine(targetLineElem) {
    if (targetLineElem) {
        targetLineElem.style.opacity = "0"
    }
}

function useDraggableBlockMenu(editor, anchorElem) {
    const scrollerElem = anchorElem.parentElement

    const menuRef = useRef(null)
    const targetLineRef = useRef(null)
    const [draggableBlockElem, setDraggableBlockElem] = useState(null)

    useEffect(() => {
        function onMouseMove(event) {
            const target = event.target
            if (!isHTMLElement(target)) {
                setDraggableBlockElem(null)
                return
            }

            if (isOnMenu(target)) {
                return
            }

            const _draggableBlockElem = getBlockElement(anchorElem, editor, event)

            setDraggableBlockElem(_draggableBlockElem)
        }

        function onMouseLeave() {
            setDraggableBlockElem(null)
        }

        scrollerElem?.addEventListener("mousemove", onMouseMove)
        scrollerElem?.addEventListener("mouseleave", onMouseLeave)

        return () => {
            scrollerElem?.removeEventListener("mousemove", onMouseMove)
            scrollerElem?.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [scrollerElem, anchorElem, editor])

    useEffect(() => {
        if (menuRef.current) {
            setMenuPosition(draggableBlockElem, menuRef.current, anchorElem)
        }
    }, [anchorElem, draggableBlockElem])

    useEffect(() => {
        function onDragover(event) {
            const { pageY, target } = event
            if (!isHTMLElement(target)) {
                return false
            }
            const targetBlockElem = getBlockElement(anchorElem, editor, event)
            const targetLineElem = targetLineRef.current
            if (targetBlockElem === null || targetLineElem === null) {
                return false
            }
            setTargetLine(targetLineElem, targetBlockElem, pageY, anchorElem)
            // Prevent default event to be able to trigger onDrop events
            event.preventDefault()
            return true
        }

        function onDrop(event) {
            const { target, dataTransfer, pageY } = event
            const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || ""
            const draggedNode = $getNodeByKey(dragData)
            if (!draggedNode) {
                return false
            }
            if (!isHTMLElement(target)) {
                return false
            }
            const targetBlockElem = getBlockElement(anchorElem, editor, event)
            if (!targetBlockElem) {
                return false
            }
            const targetNode = $getNearestNodeFromDOMNode(targetBlockElem)
            if (!targetNode) {
                return false
            }
            if (targetNode === draggedNode) {
                return true
            }
            const { top, height } = targetBlockElem.getBoundingClientRect()
            const shouldInsertAfter = pageY - top > height / 2
            if (shouldInsertAfter) {
                targetNode.insertAfter(draggedNode)
            } else {
                targetNode.insertBefore(draggedNode)
            }
            setDraggableBlockElem(null)

            return true
        }

        return mergeRegister(
            editor.registerCommand(
                DRAGOVER_COMMAND,
                event => {
                    return onDragover(event)
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                DROP_COMMAND,
                event => {
                    return onDrop(event)
                },
                COMMAND_PRIORITY_HIGH
            )
        )
    }, [anchorElem, editor])

    function onDragStart(event) {
        const dataTransfer = event.dataTransfer
        if (!dataTransfer || !draggableBlockElem) {
            return
        }
        setDragImage(dataTransfer, draggableBlockElem)
        let nodeKey = ""
        editor.update(() => {
            const node = $getNearestNodeFromDOMNode(draggableBlockElem)
            if (node) {
                nodeKey = node.getKey()
            }
        })
        dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey)
    }

    function onDragEnd() {
        hideTargetLine(targetLineRef.current)
    }

    return createPortal(
        <>
            <div
                className="icon draggable-block-menu"
                ref={menuRef}
                draggable={true}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="icon" />
            </div>
            <div className="draggable-block-target-line" ref={targetLineRef} />
        </>,
        anchorElem
    )
}

export default function DraggableBlockPlugin({ anchorElem = document.body }) {
    const [editor] = useLexicalComposerContext()
    return useDraggableBlockMenu(editor, anchorElem)
}
