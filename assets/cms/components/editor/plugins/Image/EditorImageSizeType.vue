<script setup>
const type = defineModel('type')
const value = defineModel()
</script>

<template>
    <input v-if="type === 'auto'" disabled class="form-control"/>
    <input v-else-if="['px', 'em', 'rem', 'vw', '%'].indexOf(type) >= 0"
           class="form-control"
           id="ccm-editor-theme-image-edit-dialog-src"
           type="number"
           min="0"
           v-model="value"/>

    <select class="form-select-sm" v-model="type">
        <option value="auto">Auto</option>
        <option value="px">px</option>
        <option value="em">em</option>
        <option value="rem">rem</option>
        <option value="vw">vw</option>
        <option value="vh">vh</option>
        <option value="%">%</option>
    </select>
</template>