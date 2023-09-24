<template>
    <input :="$attrs" class="form-control" autocomplete="off" @input="inputText" :value="modelValue">
</template>

<script>
    export default {
        name: 'my-input-card',
        inheritAttrs: false,

        props: {
            modelValue: [String, Number]
        },

        methods: {
            inputText(event) {
                let value = event.target.value
                this.$emit('update:model-value', value.trim())
            }
        },

        emits: ['update:model-value']
    }
</script>

<style lang="scss" scoped>
    input {
        height: 60px;
        width: 100%;
        font-size: 20px;
        border-width: 2.5px;
    }
</style>