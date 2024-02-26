<script setup>
import EditorImageSizeType from "./EditorImageSizeType.vue";
import EditorDialog from "../../EditorDialog.vue";
import {ref} from "vue";

const emit = defineEmits(['save'])

const props = defineProps({
    selected: Boolean,
    src: String,
    alt: String,
    width: String,
    widthType: String,
    height: String,
    heightType: String,
})

const dialog = ref(null)

const close = () => dialog.value !== null && dialog.value.close()
const showModal = () => dialog.value !== null && dialog.value.showModal()

const src = ref(props.src || '')
const alt = ref(props.alt || '')
const widthType = ref(props.widthType)
const width = ref(props.width)
const heightType = ref(props.heightType)
const height = ref(props.height)

defineExpose({close, showModal})

function renderSizeSet(type, value) {
    return type === 'auto' ? type : `${value}${type}`
}

function renderSize() {
    return {
        width: renderSizeSet(widthType.value, width.value),
        height: renderSizeSet(heightType.value, height.value)
    }
}

function save() {
    emit('save', {
        src: src.value,
        alt: alt.value,
        ...renderSize()
    })
}
</script>

<template>
    <EditorDialog ref="dialog">
        <template v-slot:header>
            Derp
            <button class="btn btn-outline-secondary btn-sm" @click="dialog.close()"><i class="fa fa-times"></i></button>
        </template>

        <div class="form-group">
            <label for="ccm-editor-theme-image-edit-dialog-src" class="form-label">
                Source
            </label>
            <input class="form-control" id="ccm-editor-theme-image-edit-dialog-src" v-model="src" />
        </div>
        <div class="form-group">
            <label for="ccm-editor-theme-image-edit-dialog-width" class="form-label">
                Width
            </label>

            <div class="input-group">
                <EditorImageSizeType v-model:type="widthType" v-model="width" />
            </div>
        </div>
        <div class="form-group">
            <label for="ccm-editor-theme-image-edit-dialog-width" class="form-label">
                Height
            </label>

            <div class="input-group">
                <EditorImageSizeType v-model:type="heightType" v-model="height" />
            </div>
        </div>

        <template v-slot:footer>
            <button class="btn btn-outline-primary float-end" @click.prevent="save">Save</button>
        </template>
    </EditorDialog>
</template>

<style scoped lang="scss">

</style>