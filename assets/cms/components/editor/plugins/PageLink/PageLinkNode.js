import {$isLinkNode, LinkNode} from "@lexical/link";
import {addClassNamesToElement, isHTMLAnchorElement} from "@lexical/utils";
import {$getSelection, $isElementNode, $isRangeSelection} from "lexical";
import editor from "../../Editor.vue";

export default class PageLinkNode extends LinkNode {

    /**
     *
     * @param id
     * @param {{rel: string, target: string, title: string}} attributes
     * @param key
     */
    constructor(id, attributes = {}, key) {
        super('', attributes, key);
        this.__id = id
    }

    static getType() {
        return 'concrete_page_link';
    }

    static clone(node) {
        return new PageLinkNode(
            node.__id,
            {rel: node.__rel, target: node.__target, title: node.__title},
            node.__key,
        );
    }

    getId() {
        return this.__id
    }

    static importJSON(serializedNode) {
        const node = new PageLinkNode(serializedNode.id, {
            rel: serializedNode.rel,
            target: serializedNode.target,
            title: serializedNode.title,
        });
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON() {
        const result = super.exportJSON()
        result.id = this.__id
        result.type = this.getType()
        return result
    }

    exportBaseElement(config) {
        const element = document.createElement('a');
        element.href = 'javascript:void';

        if (this.__target !== null) {
            element.target = this.__target;
        }
        if (this.__rel !== null) {
            element.rel = this.__rel;
        }
        if (this.__title !== null) {
            element.title = this.__title;
        }

        element.setAttribute('data-concrete-page-id', this.__id)

        addClassNamesToElement(element, config.theme.link);

        return element;
    }

    exportDOM(editor) {
        return {element: this.exportBaseElement(editor._config)}
    }

    createDOM(config) {
        const element = this.exportBaseElement(config)

        const parent = document.createElement('div')
        parent.style.display = 'inline'
        parent.appendChild(element)

        const supertext = document.createElement('sup')
        supertext.innerText = '[C#' + this.__id + ']'
        element.appendChild(supertext)

        return element;
    }

    updateDOM(
        prevNode,
        anchor,
        config,
    ) {
        super.updateDOM(prevNode, anchor, config)

        if (anchor.getAttribute('data-concrete-page-id') !== this.__id) {
            anchor.setAttribute('data-concrete-page-id', this.__id)
        }

        return false;
    }

    static importDOM() {
        return {
            a: (node) => {
                if (!node.hasAttribute('data-concrete-page-id')) {
                    return null
                }
                return {
                    conversion: (domNode) => {
                        let node = null;
                        if (isHTMLAnchorElement(domNode)) {
                            const content = domNode.textContent;
                            if ((content !== null && content !== '') || domNode.children.length > 0) {
                                node = new PageLinkNode(domNode.getAttribute('data-concrete-page-id'), {
                                    rel: domNode.getAttribute('rel'),
                                    target: domNode.getAttribute('target'),
                                    title: domNode.getAttribute('title'),
                                });
                            }
                        }
                        return {node};
                    },
                    priority: 2,
                }
            }
        }
    }
}

function $getAncestor(node, predicate) {
    let parent = node;
    while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
        parent = parent.getParentOrThrow();
    }
    return predicate(parent) ? parent : null;
}

export function toggleConcreteLink(id, attributes = {}) {
    const {target, title} = attributes;
    const rel = attributes.rel === undefined ? 'noreferrer' : attributes.rel;
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
        return;
    }
    const nodes = selection.extract();

    if (id === null) {
        // Remove LinkNodes
        nodes.forEach((node) => {
            const parent = node.getParent();

            if ($isPageLinkNode(parent)) {
                const children = parent.getChildren();

                for (let i = 0; i < children.length; i++) {
                    parent.insertBefore(children[i]);
                }

                parent.remove();
            }
        });
    } else {
        // Add or merge LinkNodes
        if (nodes.length === 1) {
            const firstNode = nodes[0];
            // if the first node is a LinkNode or if its
            // parent is a LinkNode, we update the URL, target and rel.
            const linkNode = $getAncestor(firstNode, $isPageLinkNode);
            if (linkNode !== null) {
                linkNode.set(url);
                if (target !== undefined) {
                    linkNode.setTarget(target);
                }
                if (rel !== null) {
                    linkNode.setRel(rel);
                }
                if (title !== undefined) {
                    linkNode.setTitle(title);
                }
                return;
            }
        }

        let prevParent = null;
        let linkNode = null;

        nodes.forEach((node) => {
            const parent = node.getParent();

            if (
                parent === linkNode ||
                parent === null ||
                ($isElementNode(node) && !node.isInline())
            ) {
                return;
            }

            if ($isPageLinkNode(parent)) {
                linkNode = parent;
                parent.setURL(url);
                if (target !== undefined) {
                    parent.setTarget(target);
                }
                if (rel !== null) {
                    linkNode.setRel(rel);
                }
                if (title !== undefined) {
                    linkNode.setTitle(title);
                }
                return;
            }

            if (!parent.is(prevParent)) {
                prevParent = parent;
                linkNode = new PageLinkNode(id, {rel, target, title})

                if ($isPageLinkNode(parent)) {
                    if (node.getPreviousSibling() === null) {
                        parent.insertBefore(linkNode);
                    } else {
                        parent.insertAfter(linkNode);
                    }
                } else {
                    node.insertBefore(linkNode);
                }
            }

            if ($isPageLinkNode(node)) {
                if (node.is(linkNode)) {
                    return;
                }
                if (linkNode !== null) {
                    const children = node.getChildren();

                    for (let i = 0; i < children.length; i++) {
                        linkNode.append(children[i]);
                    }
                }

                node.remove();
                return;
            }

            if (linkNode !== null) {
                linkNode.append(node);
            }
        });
    }
}

export function $isPageLinkNode(node) {
    return node instanceof PageLinkNode
}