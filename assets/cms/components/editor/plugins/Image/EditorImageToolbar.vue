<script setup>
import IconEdit from 'bootstrap-icons/icons/pencil-fill.svg?raw'
import IconClose from 'bootstrap-icons/icons/x-lg.svg?raw'
import IconLeft from 'bootstrap-icons/icons/chevron-bar-left.svg?raw'
import IconRight from 'bootstrap-icons/icons/chevron-bar-right.svg?raw'
import IconLeftReturn from 'bootstrap-icons/icons/chevron-right.svg?raw'
import IconRightReturn from 'bootstrap-icons/icons/chevron-left.svg?raw'
import IconCenter from 'bootstrap-icons/icons/align-center.svg?raw'
import {ref, watch} from "vue";
import EditorImageEditDialog from "./EditorImageEditDialog.vue";

const props = defineProps({
    selected: Boolean,
    format: String,
    src: String,
    alt: String,
    width: String,
    widthType: String,
    height: String,
    heightType: String,
})

const emit = defineEmits(['delete', 'update', 'format'])
const editDialog = ref(null)
const src = ref(props.src)
const alt = ref(props.alt)

const widthType = ref(props.widthType)
const heightType = ref(props.heightType)
const width = ref(props.width)
const height = ref(props.height)

function save(data) {
    editDialog.value.close()
    emit('update', data)
}
</script>

<template>
    <div class="ccm-editor-theme-image-edit" :class="{visible: selected.value === true}" @click.stop.prevent>
        <div class="btn-group">
            <button class="btn btn-secondary btn-sm"
                    v-html="IconLeft"
                    @click="emit('format', 'left')"
                    v-if="format === ''"
            ></button>
            <button class="btn btn-secondary btn-sm"
                    v-html="IconRight"
                    @click="emit('format', 'right')"
                    v-if="format === ''"
            ></button>
            <button class="btn btn-secondary btn-sm"
                    v-if="format === 'left' || format === 'right' || format === 'center'"
                    v-html="format === 'left' ? IconLeftReturn : IconRightReturn"
                    @click="emit('format', '')"
            >

            </button>
        </div>
        <div>
            <button class="btn btn-secondary btn-sm" v-html="IconEdit" @click="editDialog.showModal()"></button>
        </div>
        <div>
            <button class="btn btn-danger btn-sm" v-html="IconClose" @click="emit('delete')"></button>
        </div>
    </div>

    <EditorImageEditDialog ref="editDialog" v-bind="props" @save="save" />

    <dialog ref="deleteDialog" @click.prevent @keydown.prevent @keyup.prevent>
        <button class="btn btn-secondary" @click="editDialog.close()">Close</button>
    </dialog>
</template>

<style scoped>
.ccm-editor-theme-image-edit {
    min-width: 100px;
    min-height: 50px;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    padding: 0.5rem;
    transition: opacity 100ms ease-in-out;

    &.visible {
        opacity: 1;
    }
    > div {
        margin-left: 0.5rem;
    }
}

dialog {
    background: transparent;
    border: none;
    outline: none;
}

.btn {
    background-color: transparent;
    height: 32px;

    &:hover {
        background-color: black;
    }
}
</style>

<style>
.ccm-editor-theme-image-edit {
    .btn > svg {
        width: 14px !important;
        height: 14px !important;
    }
}
</style>