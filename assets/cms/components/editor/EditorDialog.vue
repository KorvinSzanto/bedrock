<script setup>
import {ref} from "vue";

const slots = defineSlots()

const dialog = ref(null)
const open = ref(false)

const close = () => dialog.value !== null && dialog.value.close()
const showModal = () => dialog.value !== null && dialog.value.showModal()
defineExpose({close, showModal})
</script>
<template>
    <dialog ref="dialog" @click.stop @keydown.stop @keyup.stop>
        <div class="modal show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header" v-if="slots.header">
                        <slot name="header"/>
                    </div>
                    <div class="modal-body">
                        <slot />
                    </div>
                    <div class="modal-footer" v-if="slots.footer">
                        <slot name="footer"/>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>

<style scoped>
</style>