import {DecoratorBlockNode, LexicalBlockWithAlignableContents} from "lexical-vue";
import {h, ref} from "vue";
import EditorImageNode from "./EditorImageNode.vue";
import EditorBlockWrapper from "../../EditorBlockWrapper.vue";
import EditorImageToolbar from "./EditorImageToolbar.vue";

export default class ImageNode extends DecoratorBlockNode {

    constructor(src, alt = '', width = 'auto', height = 'auto', format, key) {
        super(format, key)
        this.__src = src
        this.__alt = alt
        this.__width = this.normalizeSize(width)
        this.__height = this.normalizeSize(height)
    }

    static getType() {
        return "image"
    }

    static clone(node) {
        return $createImageNode(node.exportJSON())
    }

    static importJSON(serializedNode) {
        const node = $createImageNode(serializedNode)
        node.setFormat(serializedNode.format)
        return node
    }

    update(payload) {
        const writable = this.getWritable();
        const {src, alt, width, height, format} = payload;

        const $if = (v, c) => v !== undefined ? c(v) : null

        $if(src, v => writable.__src = v)
        $if(alt, v => writable.__alt = v)
        $if(width, v => writable.__width = v)
        $if(height, v => writable.__height = v)
        $if(format, v => writable.__format = v)
    }

    getTextContent() {
        return this.getSrc()
    }

    getSrc() {
        return this.__src
    }

    getAlt() {
        return this.__alt
    }

    getWidth() {
        return this.__width
    }

    getHeight() {
        return this.__height
    }

    parseSize(size) {
        size = `${size}`

        if (size === '0') {
            return [size, 'px']
        }

        if (size === 'auto') {
            return ['', size]
        }

        let last = size.slice(-1)
        if (last === '%') {
            return [size.slice(0, -1), last]
        }

        last = size.slice(-3)
        if (last === 'rem') {
            return [size.slice(0, -3), last]
        }

        const allowed = ['em', 'px', 'vw', 'vh']
        last = size.slice(-2)
        if (allowed.indexOf(last) > -1) {
            return [size.slice(0, -2), last]
        }

        return ['', 'auto']
    }

    normalizeSize(size) {
        if (size === undefined) {
            return 'auto'
        }
        return this.parseSize(size).join('')
    }

    exportJSON() {
        const result = super.exportJSON()
        result.type = this.getType()
        result.src = this.getSrc()
        result.alt = this.getAlt()
        result.width = this.getWidth()
        result.height = this.getHeight()

        return result
    }

    static importDOM() {
        return {
            img: (node) => ({
                conversion: (domNode) => {
                    if (domNode instanceof HTMLImageElement) {
                        const {alt, src} = domNode;
                        const {width, height, float} = domNode.style
                        const format = (float === 'left' || float === 'right') ? float : ''

                        return {node: new ImageNode(src, alt, width, height, format)};
                    }
                    return null;
                },
                priority: 0,
            }),
        };
    }


    static importDsOM() {
        return {
            img: (domNode) => {
                debugger
                if (!domNode.hasAttribute('src'))
                    return null

                return {
                    conversion: (domNode) => {
                        console.log('Converting ', domNode)
                        const src = domNode.getAttribute('src')
                        const alt = domNode.getAttribute('alt')
                        const width = domNode.getAttribute('width') || 'auto'
                        const height = domNode.getAttribute('height') || 'auto'

                        const settings = {src, width, height, alt: ''}

                        if (alt) {
                            settings.alt = alt
                        }

                        const node = $createImageNode(settings)

                        console.log('Converting ', settings, node)
                        return node
                    },
                    priority: 2,
                }
            },
        }
    }

    exportDOM() {
        const element = document.createElement('img')
        element.src = this.getSrc()
        element.style.width = this.__width
        element.style.height = this.__height
        element.alt = this.getAlt()

        if (this.__format === 'left' || this.__format === 'right') {
            element.style.float = this.__format
        }

        return {
            element
        }
    }

    isInline() {
        return true
    }

    isIsolated() {
        return false
    }

    decorate(editor, config) {
        const imageNode = this
        const theme = config.theme.embedBlock || {}

        const selected = ref(false)
        const parsedWidth = this.parseSize(this.getWidth())
        const parsedHeight = this.parseSize(this.getHeight())

        return h(EditorBlockWrapper, {
            style: 'display: inline-block',
            nodeKey: this.getKey(),
            format: this.__format,
            baseClass: theme.base,
            focusClass: theme.focus,
            type: "inline-block",
            onChange: select => selected.value = select
        }, () => ([
            h(EditorImageNode, {
                class: config.theme.image,
                src: this.getSrc(),
                width: this.getWidth(),
                height: this.getHeight(),
                alt: this.getAlt(),
            }),
            h(EditorImageToolbar, {
                selected,
                imageNode,
                src: this.getSrc(),
                alt: this.getAlt(),
                width: parsedWidth[0],
                widthType: parsedWidth[1],
                height: parsedHeight[0],
                heightType: parsedHeight[1],
                format: this.__format,
                onDelete: () => editor.update(function() {
                    imageNode.remove()
                }),
                onUpdate: updates => editor.update(() => imageNode.update(updates)),
                onFormat: format => editor.update(() => imageNode.update({format}))
            })
        ]));
    }
}

export const $createImageNode = function({src, alt = '', width = 'auto', height = 'auto'}) {
    return new ImageNode(src, alt, width, height)
}

export const $isImageNode = function(node) {
    return node instanceof ImageNode
}